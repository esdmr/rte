import * as css from './index.module.css.js';
import type {Direction, FaceButtonStyle} from './types.js';

const createFaceButton = (text: string): FaceButtonStyle[Direction] => ({
	Icon() {
		return <text x={0} y={0} class={css.maskInFill}>{text}</text>;
	},
	name: text,
});

export const lettersAb: FaceButtonStyle = {
	name: 'letters-ab',
	down: createFaceButton('A'),
	right: createFaceButton('B'),
	left: createFaceButton('X'),
	up: createFaceButton('Y'),
};

export const lettersBa: FaceButtonStyle = {
	name: 'letters-ba',
	down: createFaceButton('B'),
	right: createFaceButton('A'),
	left: createFaceButton('Y'),
	up: createFaceButton('X'),
};

export const numbersBolt: FaceButtonStyle = {
	name: 'numbers-bolt',
	down: createFaceButton('1'),
	right: createFaceButton('2'),
	left: createFaceButton('3'),
	up: createFaceButton('4'),
};

export const numbersCircle: FaceButtonStyle = {
	name: 'numbers-circle',
	up: createFaceButton('1'),
	right: createFaceButton('2'),
	down: createFaceButton('3'),
	left: createFaceButton('4'),
};
