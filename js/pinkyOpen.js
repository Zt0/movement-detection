import {handParts, OPTIONS, PINKY_EVENTS, state} from "./consts";
import {getCursorCoords, isPrimaryHandAvailable, triggerEvent} from "./helper";

function isPinkyOpened(handData) {
    if (isPrimaryHandAvailable(handData)) {
        const pinkyTip = handData.multiHandLandmarks[0][handParts.pinky.tip];
        // const thumbTip = handData.multiHandLandmarks[0][handParts.thumb.tip];
        const distance = {
            x: pinkyTip.x,
            y: pinkyTip.y,
            z: pinkyTip.z,
        };
        // const areFingersCloseEnough = distance.x < 0.08 && distance.y < 0.08 && distance.z < 0.11;
        return null;
    }
    return false;
}

export function updateOpenedPinky(handData) {
    const wasOpenedBefore = state.isPinkyOpened;
    const isPinkyOpenedNow = isPinkyOpened(handData);
    const hasPassedPinchThreshold = isPinkyOpenedNow !== wasOpenedBefore;
    const hasWaitStarted = !!state.pinkyChangeTimeout;

    if (hasPassedPinchThreshold && !hasWaitStarted) {
        registerChangeAfterWait2(handData, isPinkyOpenedNow)
    }

    if (!hasPassedPinchThreshold) {
        cancelWaitForChange2()
        if (isPinkyOpenedNow) {
            triggerEvent({
                eventName: PINKY_EVENTS.OPEN,
                eventData: getCursorCoords(handData),
            });
        }
    }
}

function registerChangeAfterWait2(handData, isPinkyOpenedNow) {
    state.pinchChangeTimeout = setTimeout(() => {
        state.isPinkyOpened = isPinkyOpenedNow;
        triggerEvent({
            eventName: isPinkyOpenedNow ? PINKY_EVENTS.OPEN : PINKY_EVENTS.CLOSE,
            eventData: getCursorCoords(handData),
        });
    }, OPTIONS.PINCH_DELAY_MS);
}

function cancelWaitForChange2() {
    clearTimeout(state.pinkyChangeTimeout);
    state.pinkyChangeTimeout = null;
}

export function onPinkyOpen(eventInfo) {
    const element = eventInfo.detail
}

export function onPinkyClose(eventInfo) {
    const element = eventInfo.detail
    state.isPrepareToShoot = false
}
