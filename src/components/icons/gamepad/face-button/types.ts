import type {FunctionComponent} from 'preact';

export type Direction = 'down' | 'right' | 'left' | 'up';

export type FaceButtonStyle = Record<Direction, {
	Icon: FunctionComponent;
	name: string;
}> & {
	name: string;
};
