import type {FunctionComponent} from 'preact';
import {scrollable} from './scrollable.module.css';
import {debugGallery} from './DebugGallery.js';
import {editorContainer} from './EditorContainer.js';
import {Link} from './Link.js';
import assert from './assert.js';
import {CloseButton} from './composition/CloseButton.js';
import {compDebugPage} from './composition/debug.js';
import {useCompLayer} from './composition/layer.js';
import {CompPage, CompPageBuilder} from './composition/page.js';
import {debugGamepad} from './gamepad/DebugGamepad.js';
import {licenses} from './licenses/index.js';
import {debugNav} from './navigation/DebugNav.js';
import {NavColumn} from './navigation/NavColumn.js';
import {NavRoot} from './navigation/NavRoot.js';
import {Button} from './navigation/wrappers.js';

const HomePage: FunctionComponent = () => {
	const layer = useCompLayer();

	return (
		<NavRoot>
			<header>
				<CloseButton />
			</header>
			<main>
				<h1>RTE</h1>
				<p>Work in progress!</p>
				<nav>
					<ul>
						<NavColumn>
							<li>
								<Link builder={editorContainer}>
									Debug Editor
								</Link>
							</li>
							<li>
								<Link builder={licenses}>Debug Licenses</Link>
							</li>
							<li>
								<Link builder={debugGallery}>
									Debug Gallery
								</Link>
							</li>
							<li>
								<Link builder={debugNav}>Debug navigation</Link>
							</li>
							<li>
								<Link builder={debugGamepad}>
									Debug gamepad
								</Link>
							</li>
							<li>
								<Button
									onClick={() => {
										const page =
											layer.findNearest(CompPage);
										assert(page, 'CompPage not found');

										compDebugPage.after(page);
									}}
								>
									Debug compositor
								</Button>
							</li>
						</NavColumn>
					</ul>
				</nav>
			</main>
		</NavRoot>
	);
};

export const homePage = new CompPageBuilder(HomePage, {});
homePage.classList.push(scrollable);
