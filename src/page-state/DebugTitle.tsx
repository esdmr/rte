import type {FunctionComponent, JSX} from 'preact';
import {useCallback, useState} from 'preact/hooks';
import {Title} from '../Title.js';
import {DebugPageNode} from './DebugPageNode.js';

export const DebugTitle: FunctionComponent = () => {
	const [titleCount, update] = useState(0);

	const updateTitleCount: JSX.GenericEventHandler<HTMLInputElement> =
		useCallback((event) => {
			const value = event.currentTarget.valueAsNumber;

			if (!Number.isSafeInteger(value) || value < 0) {
				return;
			}

			update(value);
		}, []);

	let element = <></>;

	for (let i = 0; i < titleCount; i++) {
		element = (
			<DebugPageNode>
				<Title>{String(i)}</Title>
				{element}
			</DebugPageNode>
		);
	}

	return (
		<>
			<input
				type="range"
				onChange={updateTitleCount}
				min={0}
				max={10}
				value={titleCount}
			/>

			{element}
		</>
	);
};
