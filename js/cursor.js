import {convertCoordsToDomPosition, getCursorCoords, isPrimaryHandAvailable} from "./helper";

const cursor = document.querySelector('.cursor');

export function updateCursor(handData) {
    if (isPrimaryHandAvailable(handData)) {
        const cursorCoords = getCursorCoords(handData);
        if (!cursorCoords) { return; }
        const { x, y } = convertCoordsToDomPosition(cursorCoords);
        cursor.style.transform = `translate(${x}, ${y})`;
    }
}
