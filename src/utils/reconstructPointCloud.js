/**
 * Pure JavaScript port of the monocular heuristic point-cloud reconstruction
 * used in the Python script:
 * /3DReconstruction-of-Makli/3d-reconstruction/scripts/build_ply_reconstruction_makli.py
 *
 * This mirrors the same honest framing as the Python implementation:
 * it is NOT a trained depth model, and it is NOT real multi-view SfM.
 * It is a single-image heuristic reconstruction designed to keep the browser
 * workload reasonable while matching the original algorithm's behavior.
 */

function computeHeuristicPointCloud(imageData) {
  const { data, width, height } = imageData

  const grayscale = new Float32Array(width * height)
  const edgeMap = new Float32Array(width * height)
  const brightnessMap = new Float32Array(width * height)
  const skyMask = new Uint8Array(width * height)

  // 1) Convert RGB pixels to grayscale using the standard luminance formula.
  for (let i = 0; i < data.length; i += 4) {
    const index = i / 4
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    grayscale[index] = 0.299 * r + 0.587 * g + 0.114 * b
    brightnessMap[index] = Math.max(r, g, b)
  }

  // 2) Compute Sobel gradient magnitude on the grayscale image.
  const gxKernel = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
  const gyKernel = [1, 2, 1, 0, 0, 0, -1, -2, -1]
  let maxEdge = 0

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let gx = 0
      let gy = 0

      for (let ky = -1; ky <= 1; ky += 1) {
        for (let kx = -1; kx <= 1; kx += 1) {
          const sampleX = Math.min(width - 1, Math.max(0, x + kx))
          const sampleY = Math.min(height - 1, Math.max(0, y + ky))
          const sampleIndex = sampleY * width + sampleX

          const weightX = gxKernel[(ky + 1) * 3 + (kx + 1)]
          const weightY = gyKernel[(ky + 1) * 3 + (kx + 1)]

          gx += grayscale[sampleIndex] * weightX
          gy += grayscale[sampleIndex] * weightY
        }
      }

      const magnitude = Math.sqrt(gx * gx + gy * gy)
      const index = y * width + x
      edgeMap[index] = magnitude
      maxEdge = Math.max(maxEdge, magnitude)
    }
  }

  // 3) Build a sky mask where HSV V (brightness) is greater than 205.
  let skyPixelCount = 0
  for (let i = 0; i < brightnessMap.length; i += 1) {
    const isSky = brightnessMap[i] > 205
    if (isSky) {
      skyMask[i] = 1
      skyPixelCount += 1
    }
  }

  const skyMaskedPercent = (skyPixelCount / (width * height)) * 100

  const positions = []
  const colors = []
  const depthValues = []

  const focal = 400
  const cx = width / 2
  const cy = height / 2

  // 4) Compute the depth heuristic exactly like the Python implementation.
  for (let y = 0; y < height; y += 2) {
    const rowNormalized = y / Math.max(1, height - 1)

    for (let x = 0; x < width; x += 2) {
      const index = y * width + x

      if (skyMask[index]) {
        continue
      }

      const edgeStrengthNormalized = maxEdge > 0 ? edgeMap[index] / maxEdge : 0
      const depth = Math.max(2.0, Math.min(5.0, 5.0 - 2.0 * rowNormalized - 0.6 * edgeStrengthNormalized))

      const x3d = (x - cx) * depth / focal
      const y3d = -(y - cy) * depth / focal
      const z3d = depth

      positions.push(x3d, y3d, z3d)

      const r = data[index * 4]
      const g = data[index * 4 + 1]
      const b = data[index * 4 + 2]

      colors.push(r / 255, g / 255, b / 255)
      depthValues.push(depth)
    }
  }

  const depthRange = depthValues.length > 0
    ? [Math.min(...depthValues), Math.max(...depthValues)]
    : [0, 0]

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    pointCount: positions.length / 3,
    skyMaskedPercent,
    depthRange,
  }
}

function reconstructViaWorker(imageData) {
  if (typeof window === 'undefined' || typeof window.Worker === 'undefined') {
    return null
  }

  return new Promise((resolve, reject) => {
    const worker = new window.Worker(new URL('../workers/reconstructWorker.js', import.meta.url), { type: 'module' })
    let settled = false

    const cleanup = () => {
      window.clearTimeout(workerTimeout)
      worker.terminate()
    }

    const finalize = (callback) => {
      if (settled) {
        return
      }

      settled = true
      cleanup()
      callback()
    }

    const workerTimeout = window.setTimeout(() => {
      finalize(() => reject(new Error('Point-cloud worker timed out. Falling back to the main thread.')))
    }, 30000)

    const handleMessage = (event) => {
      const { ok, result, error } = event.data || {}

      if (!ok) {
        finalize(() => reject(new Error(error || 'Point-cloud worker failed.')))
        return
      }

      finalize(() => resolve(result))
    }

    const handleError = (error) => {
      finalize(() => reject(error))
    }

    worker.addEventListener('message', handleMessage)
    worker.addEventListener('error', handleError)

    const payloadData = imageData.data.slice()
    worker.postMessage({
      type: 'reconstruct',
      width: imageData.width,
      height: imageData.height,
      data: payloadData,
    })
  })
}

export async function reconstructPointCloud(imageElement) {
  if (!(imageElement instanceof HTMLImageElement)) {
    throw new TypeError('reconstructPointCloud(imageElement) expects an HTMLImageElement input.')
  }

  // Ensure the source image is ready before reading pixels.
  if (!imageElement.complete) {
    if (typeof imageElement.decode === 'function') {
      await imageElement.decode().catch(() => undefined)
    }
  }

  if (!imageElement.width || !imageElement.height) {
    throw new Error('The provided image element does not have usable dimensions.')
  }

  const sourceWidth = imageElement.naturalWidth || imageElement.width
  const sourceHeight = imageElement.naturalHeight || imageElement.height
  const longerSide = Math.max(sourceWidth, sourceHeight)
  const maxSide = 500

  let targetWidth = sourceWidth
  let targetHeight = sourceHeight

  if (longerSide > maxSide) {
    const scale = maxSide / longerSide
    targetWidth = Math.max(1, Math.round(sourceWidth * scale))
    targetHeight = Math.max(1, Math.round(sourceHeight * scale))
  }

  const canvas = typeof OffscreenCanvas !== 'undefined'
    ? new OffscreenCanvas(targetWidth, targetHeight)
    : document.createElement('canvas')

  canvas.width = targetWidth
  canvas.height = targetHeight

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    throw new Error('Unable to acquire a 2D canvas context for reconstruction.')
  }

  ctx.drawImage(imageElement, 0, 0, targetWidth, targetHeight)
  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight)

  try {
    const workerResult = await reconstructViaWorker(imageData)
    if (workerResult) {
      return workerResult
    }
  } catch (error) {
    console.warn('Worker reconstruction was unavailable or failed; falling back to main-thread processing.', error)
  }

  return computeHeuristicPointCloud(imageData)
}
