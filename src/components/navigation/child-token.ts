import {useContext, useEffect} from 'preact/hooks';
import assert from '../../assert.js';
import {navigation} from './context.js';
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

export function useChildToken() {
	const childToken = useContext(navigation);
	assert(childToken !== undefined, 'navigation context was not setup');

	useEffect(
		() => () => {
			childToken.child?.dispose();
			childToken.child = undefined;
		},
		[],
	);

	return childToken;
}
