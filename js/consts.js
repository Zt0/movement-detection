import {object} from "./ball";

export const gravity2 = {isGravityOn: true}


export const imgTag = new Image()
imgTag.src = "./assets/basketball.png";

export const OPTIONS = {
    IS_DEBUG_MODE: false,
    // PREFERRED_HAND: leftyCheckbox.checked ? 'left' : 'right',
    PREFERRED_HAND: 'right',
    PINCH_DELAY_MS: 60,
};

export const state = {
    isPinched: false,
    isPinkyOpened: false,
    pinchChangeTimeout: null,
    pinkyChangeTimeout: null,
    grabbedElement: null,
    lastGrabbedElement: null,
};

export const PINCH_EVENTS = {
    START: 'pinch_start',
    MOVE: 'pinch_move',
    STOP: 'pinch_stop',
    PICK_UP: 'pinch_pick_up',
    DROP: 'pinch_drop',
};

export const PINKY_EVENTS = {
    OPEN: 'pinky_open',
    CLOSE: 'pinky_close',
};

export const handParts = {
    thumb: { base: 1, middle: 2, topKnuckle: 3, tip: 4 },
    indexFinger: { base: 5, middle: 6, topKnuckle: 7, tip: 8 },
    wrist: 0, middleFinger: { base: 9, middle: 10, topKnuckle: 11, tip: 12 },
    ringFinger: { base: 13, middle: 14, topKnuckle: 15, tip: 16 },
    pinky: { base: 17, middle: 18, topKnuckle: 19, tip: 20 },
}
