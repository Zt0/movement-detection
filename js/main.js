import { Camera } from "@mediapipe/camera_utils";
import { Hands } from "@mediapipe/hands";
import {OPTIONS, PINCH_EVENTS} from "./consts";
import {
    onDrop,
    onPickUp,
    onPinchMove,
    onPinchStart,
    onPinchStop,
    updatePinchState
} from "./pinch";
import {updateOpenedPinky} from "./pinkyOpen";
import {updateCursor} from "./cursor";

const videoElement = document.querySelector('.input_video');
const debugCanvas = document.querySelector('.output_canvas');

function onResults(handData) {
    if (!handData) { return; }

    updateCursor(handData);
    updatePinchState(handData);
    updateOpenedPinky(handData);
}

document.addEventListener(PINCH_EVENTS.START, onPinchStart);
document.addEventListener(PINCH_EVENTS.MOVE, onPinchMove);
document.addEventListener(PINCH_EVENTS.STOP, onPinchStop);
document.addEventListener(PINCH_EVENTS.PICK_UP, onPickUp);
document.addEventListener(PINCH_EVENTS.DROP, onDrop);

const hands = new Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    }});
hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    facingMode: 'user',
    width: 1280,
    height: 720
});
camera.start();

function startDebug() {
    debugCanvas.style.display = 'block';
    document.head.innerHTML += `
    <style>
      body.is-pinched {
        background: gold;
      }
    </style>
  `;
}
if (OPTIONS.IS_DEBUG_MODE) {
    startDebug();
}
