import * as THREE from "three"
import "./style.css"

import { initHandTracking, handLandmarks } from "./handTracking"

import { createHeartPoints } from "./particles/heart"
import { createFlowerPoints } from "./particles/flower"
import { createSaturnPoints } from "./particles/saturn"
import { createFireworkPoints } from "./particles/fireworks"

const particleCount = 3000
let currentShape = "heart"
let smoothPinch = 0
const SMOOTHING = 0.15
let smoothZoom = 1
let smoothRotation = 0

const ballCenter = new THREE.Vector3(0, 0, 0)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x111111, 1)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BufferGeometry()
const velocities = new Float32Array(particleCount * 3)

geometry.setAttribute(
  "position",
  new THREE.BufferAttribute(createHeartPoints(particleCount), 3)
)

const material = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.05,
})

const particles = new THREE.Points(geometry, material)
scene.add(particles)

const video = document.createElement("video")
video.style.display = "none"
document.body.appendChild(video)
initHandTracking(video)

function getPinchStrength(hand) {
  if (!hand || hand.length < 9) return 0
  const a = hand[4]
  const b = hand[8]
  if (!a || !b) return 0
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

function getPalmCenter(hand) {
  const w = hand[0]
  const m = hand[9]
  return {
    x: (w.x + m.x) / 2,
    y: (w.y + m.y) / 2,
    z: (w.z + m.z) / 2,
  }
}

function mapHandToWorld(p) {
  return {
    x: (p.x - 0.5) * 6,
    y: (0.5 - p.y) * 4,
    z: -p.z * 6,
  }
}

function applyCircularField(center, strength = 0.015) {
  const pos = geometry.attributes.position.array

  for (let i = 0; i < pos.length; i += 3) {
    const dx = pos[i] - center.x
    const dy = pos[i + 1] - center.y

    pos[i]     += -dy * strength
    pos[i + 1] +=  dx * strength
  }

  geometry.attributes.position.needsUpdate = true
}

function updateShape(shape) {
  let points

  switch (shape) {
    case "heart":
      points = createHeartPoints(particleCount)
      break
    case "flower":
      points = createFlowerPoints(particleCount)
      break
    case "saturn":
      points = createSaturnPoints(particleCount)
      break
    case "firework":
      points = createFireworkPoints(particleCount)
      for (let i = 0; i < velocities.length; i++) {
        velocities[i] = (Math.random() - 0.5) * 0.25
      }
      break
    default:
      return
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(points, 3)
  )
  geometry.attributes.position.needsUpdate = true
}

function animate() {
  requestAnimationFrame(animate)

  const hands = Array.isArray(handLandmarks)
    ? handLandmarks.filter(h => h && h.length >= 21)
    : []
  if (hands.length === 1) {
    const palm = getPalmCenter(hands[0])
    const target = mapHandToWorld(palm)

    ballCenter.lerp(
      new THREE.Vector3(target.x, target.y, target.z),
      0.12
    )
    particles.position.copy(ballCenter)

    applyCircularField(ballCenter)

    const rawPinch = getPinchStrength(hands[0])
    smoothPinch += (rawPinch - smoothPinch) * SMOOTHING

    particles.scale.setScalar(1 + smoothPinch * 6)
    material.color.setHSL(smoothPinch * 2, 1, 0.6)

    if (smoothPinch < 0.02 && currentShape !== "heart") {
      currentShape = "heart"
      updateShape("heart")
    } else if (smoothPinch < 0.05 && currentShape !== "flower") {
      currentShape = "flower"
      updateShape("flower")
    } else if (smoothPinch < 0.08 && currentShape !== "saturn") {
      currentShape = "saturn"
      updateShape("saturn")
    } else if (smoothPinch >= 0.08 && currentShape !== "firework") {
      currentShape = "firework"
      updateShape("firework")
    }
  }
  else if (hands.length === 2) {
    const a = getPalmCenter(hands[0])
    const b = getPalmCenter(hands[1])

    const dx = a.x - b.x
    const dy = a.y - b.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    const targetZoom = THREE.MathUtils.clamp(dist * 10, 1, 6)
    smoothZoom += (targetZoom - smoothZoom) * 0.12
    particles.scale.setScalar(smoothZoom)

    const angle = Math.atan2(dy, dx)
    smoothRotation += (angle - smoothRotation) * 0.15
    particles.rotation.y = smoothRotation
  }
  if (currentShape === "firework") {
    const pos = geometry.attributes.position.array
    for (let i = 0; i < pos.length; i++) {
      pos[i] += velocities[i]
      velocities[i] *= 0.95
    }
    geometry.attributes.position.needsUpdate = true
  }

  renderer.render(scene, camera)
}
animate()

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
