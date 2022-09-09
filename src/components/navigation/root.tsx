import type {FunctionComponent} from 'preact';
import {useMemo, useEffect} from 'preact/hooks';
import {navColumnHooks} from './column.js';
import {wrapNavChildren} from './context.js';
import {NavNode} from './node.js';

export const NavRoot: FunctionComponent = ({children}) => {
	const rootNode = useMemo(() => new NavNode(undefined, navColumnHooks), []);

	useEffect(() => {
		console.debug({rootNode});

		// FIXME: Remove.
		(globalThis as any).rootNode = rootNode;

		// FIXME: Move to separate API.
		const controller = new AbortController();

		document.body.addEventListener(
			'keydown',
			(event) => {
				if (!/^Arrow(?:Up|Down|Left|Right)$/.test(event.code)) {
					return;
				}

				event.preventDefault();

				if (!rootNode.state.selected) {
					rootNode.getLeaf('next')?.select();
					return;
				}

				switch (event.code) {
					case 'ArrowUp':
						rootNode.state.up();
						break;

					case 'ArrowDown':
						rootNode.state.down();
						break;

					case 'ArrowLeft':
						rootNode.state.left();
						break;

					case 'ArrowRight':
						rootNode.state.right();
						break;

					// No default
				}
			},
			{signal: controller.signal},
		);

		document.body.addEventListener(
			'focusin',
			(event) => {
				if (event.target instanceof HTMLElement) {
					const node = rootNode.state.elementToNode.get(event.target);
					node?.select();
				}
			},
			{signal: controller.signal},
		);

		return () => {
			rootNode.state.deselect();

			// FIXME: Move to separate API.
			controller.abort();
		};
	}, [rootNode]);

	return wrapNavChildren(rootNode, children);
};
