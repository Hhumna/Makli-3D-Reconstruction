const gxKernel = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
const gyKernel = [1, 2, 1, 0, 0, 0, -1, -2, -1]

function computeHeuristicPointCloud(imageData) {
  const { data, width, height } = imageData

  const grayscale = new Float32Array(width * height)
  const edgeMap = new Float32Array(width * height)
  const brightnessMap = new Float32Array(width * height)
  const skyMask = new Uint8Array(width * height)

  for (let i = 0; i < data.length; i += 4) {
    const index = i / 4
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    grayscale[index] = 0.299 * r + 0.587 * g + 0.114 * b
    brightnessMap[index] = Math.max(r, g, b)
  }

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

self.onmessage = (event) => {
  const { type, width, height, data } = event.data || {}

  if (type !== 'reconstruct') {
    return
  }

  try {
    const pixelData = data instanceof Uint8ClampedArray
      ? data
      : new Uint8ClampedArray(data)

    const result = computeHeuristicPointCloud({
      data: pixelData,
      width,
      height,
    })

    self.postMessage({ ok: true, result })
  } catch (error) {
    self.postMessage({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
