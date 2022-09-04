import * as css from './index.module.css.js';
import type {Direction, FaceButtonStyle} from './types.js';

const createFaceButton = (text: string): FaceButtonStyle[Direction] => ({
	Icon() {
		return <text x={0} y={0} class={css.maskInFill}>{text}</text>;
	},
	name: text,
});

export const lettersAb: FaceButtonStyle = /* @__PURE__ */ {
	name: 'letters-ab',
	down: createFaceButton('A'),
	right: createFaceButton('B'),
	left: createFaceButton('X'),
	up: createFaceButton('Y'),
};

export const lettersBa: FaceButtonStyle = /* @__PURE__ */ {
	name: 'letters-ba',
	down: createFaceButton('B'),
	right: createFaceButton('A'),
	left: createFaceButton('Y'),
	up: createFaceButton('X'),
};
