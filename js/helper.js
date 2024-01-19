import {object} from "./ball";
import {handParts, OPTIONS} from "./consts";

export function convertCoordsToDomPosition({ x, y }) {
    return {
        x: `${x * 100}vw`,
        y: `${y * 100}vh`,
    };
}

export function getCursorCoords(handData) {
    const { x, y, z } = handData.multiHandLandmarks[0][handParts.indexFinger.middle];
    const mirroredXCoord = -x + 1; /* due to camera mirroring */
    return { x: mirroredXCoord, y, z };
}

export function getElementCoords(element) {
    const elementTop = object.pos.y / window.innerHeight;
    const elementBottom = (object.pos.y + 60) / window.innerHeight;
    const elementLeft = object.pos.x / window.innerWidth;
    const elementRight = (object.pos.x + 60) / window.innerWidth;
    return { elementTop, elementBottom, elementLeft, elementRight };
}

export function triggerEvent({ eventName, eventData }) {
    const event = new CustomEvent(eventName, { detail: eventData });
    document.dispatchEvent(event);
}

export function getCurrentHand(handData) {
    const isHandAvailable = !!handData.multiHandLandmarks?.[0];
    if (!isHandAvailable) { return null; }
    const mirroredHand = handData.multiHandedness[0].label === 'Left' ? 'right' : 'left';
    return mirroredHand;
}

export function isPrimaryHandAvailable(handData) {
    return getCurrentHand(handData) === OPTIONS.PREFERRED_HAND;
}
