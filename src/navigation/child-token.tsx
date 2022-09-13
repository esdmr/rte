import {createContext, type ComponentChildren, toChildArray} from 'preact';
import {useContext, useEffect} from 'preact/hooks';
import assert from '../assert.js';
import type {NavNode} from './node.js';

export class NavChildToken {
	private revoked = false;

	constructor(readonly parent: NavNode, private readonly index: number) {}

	revoke() {
		this.clear();
		this.revoked = true;
	}

	clear() {
		if (this.revoked) {
			return;
		}

		this.child?.dispose();
		this.child = undefined;
	}

	get child() {
		if (this.revoked) {
			return undefined;
		}

		return this.parent.children[this.index];
	}

	set child(node: NavNode | undefined) {
		assert(!this.revoked, 'child token is revoked');

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

export const useChildToken = () => {
	const childToken = useContext(navChildToken);
	assert(childToken !== undefined, 'navChildToken context was not setup');

	useEffect(
		() => () => {
			childToken.clear();
		},
		[childToken],
	);

	return childToken;
};

export const wrapNavChildren = (node: NavNode, children: ComponentChildren) => {
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
};
