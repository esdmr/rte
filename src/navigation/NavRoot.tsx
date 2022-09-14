import type {FunctionComponent, Ref} from 'preact';
import {useMemo, useEffect} from 'preact/hooks';
import {type UnaryProps, navUnaryHooks} from './unary.js';
import {wrapNavChildren} from './child-token.js';
import {NavNode} from './node.js';
import {setRef} from './utils.js';

type NavRootProps = UnaryProps & {
	'nav-ref'?: Ref<NavNode>;
};

export const NavRoot: FunctionComponent<NavRootProps> = (props) => {
	const rootNode = useMemo(() => new NavNode(undefined, navUnaryHooks), []);

	useEffect(() => {
		setRef(props['nav-ref'], rootNode);

		// FIXME: Remove.
		console.debug({rootNode});
		(globalThis as any).rootNode = rootNode;

		return () => {
			rootNode.state.deselect();
			setRef(props['nav-ref'], null);
		};
	}, [rootNode]);

	return wrapNavChildren(rootNode, props.children);
};
