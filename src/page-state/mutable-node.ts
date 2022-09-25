import {type PageStateHooks, PageStateNode} from './node.js';
import {queueUpdate} from './update.js';

const emptyHooks: PageStateHooks = Object.freeze({});

export class MutablePageStateNode extends PageStateNode {
	protected declare hooks: PageStateHooks;

	constructor(parent: PageStateNode | undefined, root?: HTMLElement) {
		super(parent, emptyHooks, root);
	}

	setHooks(hooks: PageStateHooks = emptyHooks) {
		if (this.hooks !== hooks && this.connected) {
			queueUpdate();
		}

		this.hooks = hooks;
	}
}
