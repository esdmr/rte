import type {PageStateHooks} from './node.js';

/** @deprecated */
export const voidPageState: PageStateHooks = {
	onFocusIn() {
		return true;
	},
	onGamepad() {
		return true;
	},
	onKeyDown() {
		return true;
	},
	applyInputGuideEntries(entries) {
		entries.length = 0;
	},
};
