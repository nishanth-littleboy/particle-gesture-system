import { Hands } from "@mediapipe/hands"
import { Camera } from "@mediapipe/camera_utils"
export let handLandmarks = []

export function initHandTracking(video) {
  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  })

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 0,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  })

  hands.onResults((results) => {
    if (results.multiHandLandmarks) {
      handLandmarks = results.multiHandLandmarks
    } else {
      handLandmarks = []
    }
  })

  const camera = new Camera(video, {
    onFrame: async () => {
      try {
        await hands.send({ image: video })
      } catch (e) {

      }
    },
    width: 640,
    height: 480,
  })

  camera.start()
}
