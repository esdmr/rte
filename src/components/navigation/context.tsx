import {createContext, type ComponentChildren, toChildArray} from 'preact';
import type {NavChildToken} from './child-token.js';
import type {NavNode} from './node.js';

export const navigation = createContext<NavChildToken | undefined>(undefined);

if (import.meta.env.DEV) {
	navigation.displayName = 'navigation';
}

export function wrapNavChildren(node: NavNode, children: ComponentChildren) {
	return (
		<>
			{toChildArray(children).map((child) =>
				typeof child === 'object' ? (
					<navigation.Provider
						value={node.newChildToken()}
						key={child.key as unknown}
					>
						{child}
					</navigation.Provider>
				) : (
					child
				),
			)}
		</>
	);
}
