export function createFlowerPoints(count) {
  const points = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2
    const r = Math.sin(5 * t)

    const x = r * Math.cos(t)
    const y = r * Math.sin(t)

    points[i * 3] = x * 2
    points[i * 3 + 1] = y * 2
    points[i * 3 + 2] = (Math.random() - 0.5)
  }

  return points
}
