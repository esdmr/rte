import type {FunctionComponent} from 'preact';
import {useEffect, useMemo} from 'preact/hooks';
import {pageStateContext, usePageState} from '../page-state/global.js';
import {MutablePageStateNode} from '../page-state/mutable-node.js';
import {navPageState as navPageStateHooks} from '../page-state/navigation.js';
import {PageStateNode} from '../page-state/node.js';
import {wrapNavChildren} from './child-token.js';
import {NavNode} from './node.js';
import {navUnaryHooks, type UnaryProps} from './unary.js';

declare global {
	/** Used for debugging. Only available in development mode. */
	// eslint-disable-next-line no-var
	var navRootNode: NavNode | undefined;
}

export const NavRoot: FunctionComponent<UnaryProps> = (props) => {
	const rootNode = useMemo(() => new NavNode(undefined, navUnaryHooks), []);
	const parentPageState = usePageState();
	const pageState = useMemo(
		() => new PageStateNode(parentPageState, navPageStateHooks(rootNode)),
		[parentPageState],
	);
	const selectedNodePageState = useMemo(
		() => new MutablePageStateNode(pageState),
		[pageState],
	);

	useEffect(() => {
		parentPageState.child = pageState;

		return () => {
			pageState.dispose();
		};
	}, [pageState]);

	useEffect(() => {
		pageState.child = selectedNodePageState;
		rootNode.state.selectedNodePageState = selectedNodePageState;

		return () => {
			selectedNodePageState.dispose();
			rootNode.state.selectedNodePageState = undefined;
		};
	}, [selectedNodePageState]);

	useEffect(
		() => () => {
			rootNode.state.deselect();
			rootNode.dispose();
		},
		[rootNode],
	);

	if (import.meta.env.DEV) {
		globalThis.navRootNode = rootNode;
	}

	return (
		<pageStateContext.Provider value={selectedNodePageState}>
			{wrapNavChildren(rootNode, props.children)}
		</pageStateContext.Provider>
	);
};
