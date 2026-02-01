export function createFireworkPoints(count) {
  const points = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const r = Math.random() * 3

    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.cos(phi)
    const z = r * Math.sin(phi) * Math.sin(theta)

    points[i * 3] = x
    points[i * 3 + 1] = y
    points[i * 3 + 2] = z
  }

  return points
}
