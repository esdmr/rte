import type {FunctionComponent} from 'preact';

export type Direction = 'down' | 'right' | 'left' | 'up';

export type FaceButtonStyle = Record<
	Direction,
	{
		readonly Icon: FunctionComponent;
		readonly name: string;
	}
> & {
	readonly name: string;
};
