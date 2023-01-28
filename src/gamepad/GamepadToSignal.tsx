import {signal} from '@preact/signals';
import type {FunctionComponent} from 'preact';
import {useEffect, useMemo} from 'preact/hooks';
import {pageStateContext, usePageState} from '../page-state/global.js';
import {PageStateNode} from '../page-state/node.js';
import type {GamepadClone} from './diff.js';

export const gamepads = signal<readonly GamepadClone[]>([]);

export const GamepadToSignal: FunctionComponent = (props) => {
	const parentPageState = usePageState();

	const pageState = useMemo(
		() =>
			new PageStateNode(parentPageState, {
				onGamepad(newGamepads) {
					gamepads.value = newGamepads;

					return false;
				},
			}),
		[parentPageState],
	);

	useEffect(() => {
		parentPageState.child = pageState;

		return () => {
			pageState.dispose();
		};
	}, [parentPageState]);

	return (
		<pageStateContext.Provider value={pageState}>
			{props.children}
		</pageStateContext.Provider>
	);
};
