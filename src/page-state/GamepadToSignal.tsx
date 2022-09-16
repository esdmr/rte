import {signal} from '@preact/signals';
import type {FunctionComponent} from 'preact';
import {useContext, useEffect, useMemo} from 'preact/hooks';
import type {GamepadClone} from './gamepad.js';
import {pageStateContext} from './global.js';
import {PageStateNode} from './node.js';

export const gamepads = signal<GamepadClone[]>([]);

export const GamepadToSignal: FunctionComponent = (props) => {
	const parentPageState = useContext(pageStateContext);

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
