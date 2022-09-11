import {createContext, type ComponentChildren, toChildArray} from 'preact';
import {useContext, useEffect} from 'preact/hooks';
import assert from '../../assert.js';
import type {NavNode} from './node.js';

export class NavChildToken {
	constructor(readonly parent: NavNode, private readonly index: number) {}

	get child() {
		return this.parent.children[this.index];
	}

	set child(node: NavNode | undefined) {
		if (node !== undefined) {
			assert(
				this.parent.children[this.index] === undefined,
				'more than one child node assigned to token',
			);
		}

		this.parent.children[this.index] = node;
	}
}

export const navChildToken = createContext<NavChildToken | undefined>(
	undefined,
);

if (import.meta.env.DEV) {
	navChildToken.displayName = 'navChildToken';
}

export function useChildToken() {
	const childToken = useContext(navChildToken);
	assert(childToken !== undefined, 'navChildToken context was not setup');

	useEffect(
		() => () => {
			childToken.child?.dispose();
			childToken.child = undefined;
		},
		[childToken],
	);

	return childToken;
}

export function wrapNavChildren(node: NavNode, children: ComponentChildren) {
	return (
		<>
			{toChildArray(children).map((child) =>
				typeof child === 'object' ? (
					<navChildToken.Provider
						value={node.newChildToken()}
						key={child.key as unknown}
					>
						{child}
					</navChildToken.Provider>
				) : (
					child
				),
			)}
		</>
	);
}
