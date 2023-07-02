import assert from '../assert.js';
import {NavChildToken} from './child-token.js';
import type {NavHooks, NavNode} from './node.js';

const childTokens = new WeakMap<NavNode, NavChildToken>();

/** @deprecated */
export const navUnaryHooks: NavHooks = {
	type: 'deprecated-unary',
	onNewChild() {
		assert(
			this.children.length <= 1,
			'unary NavNode cannot have more than one child',
		);

		const oldChildToken = childTokens.get(this);
		oldChildToken?.revoke();

		const newChildToken = new NavChildToken(this, 0);
		childTokens.set(this, newChildToken);

		return newChildToken;
	},
	getLeaf(via) {
		return this.children[0]?.getLeaf(via);
	},
	getNextLeaf(_child, dir) {
		return this.parent?.getNextLeaf(this, dir);
	},
};
