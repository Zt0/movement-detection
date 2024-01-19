import {
    convertCoordsToDomPosition,
    getCursorCoords,
    getElementCoords,
    isPrimaryHandAvailable,
    triggerEvent
} from "./helper";
import {gravity2, handParts, imgTag, OPTIONS, PINCH_EVENTS, state} from "./consts";
import {ballCtx, object} from "./ball";

const ballContext = document.querySelectorAll('#test')
export const movableElements = [
    ...ballContext,
];

export function isElementPinched({ pinchX, pinchY, elementTop, elementBottom, elementLeft, elementRight }) {
    const isPinchInXRange = elementLeft <= pinchX && pinchX <= elementRight;
    const isPinchInYRange = elementTop <= pinchY && pinchY <= elementBottom;
    return isPinchInXRange && isPinchInYRange;
}

function getPinchedElement({ pinchX, pinchY, elements }) {
    let grabbedElement;
    for (const element of elements) {
        const elementCoords = getElementCoords(element);
        if (isElementPinched({ pinchX, pinchY, ...elementCoords })) {
            grabbedElement = {
                domNode: element,
                coords: {
                    x: elementCoords.elementLeft,
                    y: elementCoords.elementTop,
                },
                offsetFromCorner: {
                    x: pinchX - elementCoords.elementLeft,
                    y: pinchY - elementCoords.elementTop,
                },
            };
            const isTopElement = element === state.lastGrabbedElement;
            if (isTopElement) {
                return grabbedElement;
            }
        }
    }
    return grabbedElement;
};

export function onPinchStart(eventInfo) {
    const cursorCoords = eventInfo.detail;
    state.grabbedElement = getPinchedElement({
        pinchX: cursorCoords.x,
        pinchY: cursorCoords.y,
        elements: movableElements,
    });
    if (state.grabbedElement) {
        triggerEvent({
            eventName: PINCH_EVENTS.PICK_UP,
            eventData: state.grabbedElement.domNode,
        });
    }

    document.body.classList.add('is-pinched');
}

 export function onPinchMove(eventInfo) {
     const cursorCoords = eventInfo.detail;
     if (state.grabbedElement) {
         gravity2.isGravityOn = false
         state.grabbedElement.coords = {
             x: cursorCoords.x - state.grabbedElement.offsetFromCorner.x,
             y: cursorCoords.y - state.grabbedElement.offsetFromCorner.y,
         };
         const { x, y } = convertCoordsToDomPosition(state.grabbedElement.coords);
         const xToPx = x.replace(/[a-z]/g, '')
         const yToPx = y.replace(/[a-z]/g, '')
         object.pos.x = xToPx * window.innerWidth / 100
         object.pos.y = yToPx * window.innerHeight / 100
         ballCtx.clearRect(0, 0, ballCtx.canvas.width, ballCtx.canvas.height)
         ballCtx.drawImage(imgTag, object.pos.x, object.pos.y, 60, 60)
     }
 }

export function onPinchStop() {
    gravity2.isGravityOn = true
    document.body.classList.remove('is-pinched');
    if (state.grabbedElement) {
        triggerEvent({
            eventName: PINCH_EVENTS.DROP,
            eventData: state.grabbedElement.domNode,
        });
    }
}

export function updatePinchState(handData) {
    const wasPinchedBefore = state.isPinched;
    const isPinchedNow = isPinched(handData);
    const hasPassedPinchThreshold = isPinchedNow !== wasPinchedBefore
    const hasWaitStarted = !!state.pinchChangeTimeout

    if (hasPassedPinchThreshold && !hasWaitStarted) {
        registerChangeAfterWait(handData, isPinchedNow)
    }

    if (!hasPassedPinchThreshold) {
        cancelWaitForChange()
        if (isPinchedNow) {
            triggerEvent({
                eventName: PINCH_EVENTS.MOVE,
                eventData: getCursorCoords(handData),
            })
        }
    }
}

function registerChangeAfterWait(handData, isPinchedNow) {
    state.pinchChangeTimeout = setTimeout(() => {
        state.isPinched = isPinchedNow;
        triggerEvent({
            eventName: isPinchedNow ? PINCH_EVENTS.START : PINCH_EVENTS.STOP,
            eventData: getCursorCoords(handData),
        });
    }, OPTIONS.PINCH_DELAY_MS);
}

function isPinched(handData) {
    if (isPrimaryHandAvailable(handData)) {
        const fingerTip = handData.multiHandLandmarks[0][handParts.indexFinger.tip];
        const thumbTip = handData.multiHandLandmarks[0][handParts.thumb.tip];
        const distance = {
            x: Math.abs(fingerTip.x - thumbTip.x),
            y: Math.abs(fingerTip.y - thumbTip.y),
            z: Math.abs(fingerTip.z - thumbTip.z),
        };
        const areFingersCloseEnough = distance.x < 0.08 && distance.y < 0.08 && distance.z < 0.11;
        return areFingersCloseEnough;
    }
    return false;
}

function cancelWaitForChange() {
    clearTimeout(state.pinchChangeTimeout);
    state.pinchChangeTimeout = null;
}

export function onPickUp(eventInfo) {
    const element = eventInfo.detail
    state.lastGrabbedElement?.style.removeProperty('z-index')
    state.lastGrabbedElement = element
    element.style.zIndex = 1
    element.classList.add('element_dragging')
}

export function onDrop(eventInfo) {
    const element = eventInfo.detail
    state.isDragging = false
    state.grabbedElement = undefined
    element.classList.remove('element_dragging')
}
