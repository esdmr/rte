import {CompositorLayer} from './layer.js';
import * as css from './debug.module.css.js';
import {CompositorDialog} from './dialog.js';
import {CompositorGlobalGroup} from './global-group.js';
import {CompositorPage} from './page.js';

// First…

const root = new CompositorGlobalGroup(document.body);

// Now:

const overlay = new CompositorLayer();
overlay.render(
	<span>Just press the buttons, it’s easy!</span>,
);
overlay.classList.add(css.overlay);
root.overlays.append(overlay);

// And…

const page = new CompositorPage();
page.content.render(
	<>
		<h1>Hello, World!</h1>
		<button
			onClick={() => {
				const dialog = new CompositorDialog();
				dialog.render(
					<button
						onClick={() => {
							dialog.result.resolve();
						}}
					>
						Close
					</button>,
				);
				dialog.classList.add(css.dialog);
				page.dialogs.append(dialog);
			}}
		>
			Open dialog
		</button>
	</>,
);
page.content.classList.add(css.page);
root.pages.append(page);

// In any order.
