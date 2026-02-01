export function createSaturnPoints(count) {
  const points = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 3

    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const y = (Math.random() - 0.5) * 0.3

    points[i * 3] = x
    points[i * 3 + 1] = y
    points[i * 3 + 2] = z
  }

  return points
}
