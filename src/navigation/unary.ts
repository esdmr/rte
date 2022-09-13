import type {ComponentChild} from 'preact';
import assert from '../assert.js';
import {NavChildToken} from './child-token.js';
import type {NavHooks, NavNode} from './node.js';

export type UnaryProps = {
	children: ComponentChild;
};

const childTokens = new WeakMap<NavNode, NavChildToken>();

export const navUnaryHooks: NavHooks = {
	onDispose() {
		throw new Error('Disposal of a unary NavItem');
	},
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
