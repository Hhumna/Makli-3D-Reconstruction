export function buildPlyString(positions, colors, commentLines = []) {
  if (!(positions instanceof Float32Array || Array.isArray(positions))) {
    throw new TypeError('buildPlyString(positions, colors, commentLines) expects positions to be a Float32Array or array-like number sequence.')
  }

  if (!(colors instanceof Float32Array || Array.isArray(colors))) {
    throw new TypeError('buildPlyString(positions, colors, commentLines) expects colors to be a Float32Array or array-like number sequence.')
  }

  if (positions.length % 3 !== 0) {
    throw new Error('positions must contain x,y,z triplets.')
  }

  if (colors.length !== positions.length) {
    throw new Error('colors must have the same length as positions, with one RGB triplet per point.')
  }

  const pointCount = positions.length / 3
  const safeCommentLines = Array.isArray(commentLines) ? commentLines : []
  const lines = [
    'ply',
    'format ascii 1.0',
    ...safeCommentLines.map((comment) => `comment ${comment}`),
    `element vertex ${pointCount}`,
    'property float x',
    'property float y',
    'property float z',
    'property uchar red',
    'property uchar green',
    'property uchar blue',
    'end_header',
  ]

  for (let i = 0; i < pointCount; i += 1) {
    const base = i * 3
    const x = positions[base]
    const y = positions[base + 1]
    const z = positions[base + 2]

    const r = Math.max(0, Math.min(255, Math.round(colors[base] * 255)))
    const g = Math.max(0, Math.min(255, Math.round(colors[base + 1] * 255)))
    const b = Math.max(0, Math.min(255, Math.round(colors[base + 2] * 255)))

    lines.push(`${x.toFixed(4)} ${y.toFixed(4)} ${z.toFixed(4)} ${r} ${g} ${b}`)
  }

  return `${lines.join('\n')}\n`
}

export function downloadPly(plyString, filename = 'reconstruction.ply') {
  if (typeof document === 'undefined' || typeof Blob === 'undefined' || typeof URL === 'undefined') {
    throw new Error('downloadPly(plyString, filename) requires a browser environment with Blob, URL, and document support.')
  }

  const blob = new Blob([plyString], { type: 'text/plain' })
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = objectUrl
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(objectUrl)
}
