import type {FunctionComponent} from 'preact';
import {useEffect, useMemo} from 'preact/hooks';
import {pageStateContext, usePageState} from '../page-state/global.js';
import {navPageState as navPageStateHooks} from '../page-state/navigation.js';
import {PageStateNode} from '../page-state/node.js';
import {wrapNavChildren} from './child-token.js';
import {NavNode} from './node.js';
import {navUnaryHooks, type UnaryProps} from './unary.js';

export const NavRoot: FunctionComponent<UnaryProps> = (props) => {
	const rootNode = useMemo(() => new NavNode(undefined, navUnaryHooks), []);
	const parentPageState = usePageState();
	const pageState = useMemo(
		() => new PageStateNode(parentPageState, navPageStateHooks(rootNode)),
		[parentPageState],
	);

	useEffect(() => {
		parentPageState.child = pageState;

		return () => {
			pageState.dispose();
		};
	}, [parentPageState]);

	useEffect(() => {
		// FIXME: Remove.
		console.debug({rootNode});
		(globalThis as any).rootNode = rootNode;

		return () => {
			rootNode.state.deselect();
			rootNode.dispose();
		};
	}, [rootNode]);

	return (
		<pageStateContext.Provider value={pageState}>
			{wrapNavChildren(rootNode, props.children)}
		</pageStateContext.Provider>
	);
};
