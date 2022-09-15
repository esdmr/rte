import type {NavNode} from '../navigation/node.js';
import type {PageStateHooks} from './node.js';

export const navPageState = (root: NavNode): PageStateHooks => ({
	onKeyDown(event) {
		if (!/^Arrow(?:Up|Down|Left|Right)$/.test(event.code)) {
			return false;
		}

		event.preventDefault();

		if (!root.state.selected) {
			root.getLeaf('next')?.select();
			return true;
		}

		switch (event.code) {
			case 'ArrowUp':
				root.state.up();
				break;

			case 'ArrowDown':
				root.state.down();
				break;

			case 'ArrowLeft':
				root.state.left();
				break;

			case 'ArrowRight':
				root.state.right();
				break;

			// No default
		}

		return true;
	},
	onFocusIn(event) {
		if (!(event.target instanceof HTMLElement)) {
			return false;
		}

		const node = root.state.elementToNode.get(event.target);
		node?.select();
		return true;
	},
});
