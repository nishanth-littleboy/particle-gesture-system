export function createHeartPoints(count) {
  const points = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2

    const x = 16 * Math.pow(Math.sin(t), 3)
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)

    points[i * 3] = x * 0.05
    points[i * 3 + 1] = y * 0.05
    points[i * 3 + 2] = (Math.random() - 0.5) * 0.5
  }

  return points
}
