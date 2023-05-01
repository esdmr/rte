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
	var navRootNode: NavNode | undefined;
}

export const NavRoot: FunctionComponent = (props) => {
	const rootNode = useMemo(() => new NavNode(undefined, navColumnHooks), []);
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

		return () => {
			controller.abort();
		};
	}, [rootNode, layer]);

	if (import.meta.env.DEV) {
		globalThis.navRootNode = rootNode;
	}

	return <>{wrapNavChildren(rootNode, props.children)}</>;
};
