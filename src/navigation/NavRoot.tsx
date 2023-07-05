import type {FunctionComponent} from 'preact';
import {useEffect, useMemo} from 'preact/hooks';
import {useCompLayer} from '../composition/layer.js';
import {wrapNavChildren} from './child-token.js';
import {NavNode} from './node.js';
import {navColumnHooks} from './NavColumn.js';
import {setupNavigation} from './composition.js';

declare global {
	/** Used for debugging. Only available in development mode. */
	// eslint-disable-next-line no-var
	var navRootNodes: Set<NavNode> | undefined;
}

if (import.meta.env.DEV) {
	globalThis.navRootNodes = new Set();
}

export const NavRoot: FunctionComponent<{
	name?: string;
}> = (props) => {
	const rootNode = useMemo(
		() => new NavNode(undefined, navColumnHooks, props.name),
		[],
	);
	const layer = useCompLayer();

	useEffect(
		() => () => {
			rootNode.state.deselect();
			rootNode.dispose();
		},
		[rootNode],
	);

	useEffect(() => {
		const controller = new AbortController();
		setupNavigation(rootNode, layer, controller.signal);

		if (import.meta.env.DEV) {
			globalThis.navRootNodes?.add(rootNode);
		}

		return () => {
			if (import.meta.env.DEV) {
				globalThis.navRootNodes?.delete(rootNode);
			}

			controller.abort();
		};
	}, [rootNode, layer]);

	return <>{wrapNavChildren(rootNode, props.children)}</>;
};
