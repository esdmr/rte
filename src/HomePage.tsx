import type {FunctionComponent} from 'preact';
import {debugGallery} from './DebugGallery.js';
import {editorContainer} from './EditorContainer.js';
import {CloseButton} from './composition/CloseButton.js';
import {compDebugPage} from './composition/debug.js';
import {useCompLayer} from './composition/layer.js';
import {CompPageBuilder} from './composition/page.js';
import {debugGamepad} from './gamepad/DebugGamepad.js';
import {licenses} from './licenses/index.js';
import {debugNav} from './navigation/DebugNav.js';
import {NavColumn} from './navigation/NavColumn.js';
import {NavRoot} from './navigation/NavRoot.js';
import {Button} from './navigation/wrappers.js';
import {scrollable} from './scrollable.module.css';

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
								<Button
									onClick={editorContainer.afterOnClick(
										layer,
									)}
								>
									Debug Editor
								</Button>
							</li>
							<li>
								<Button onClick={licenses.afterOnClick(layer)}>
									Debug Licenses
								</Button>
							</li>
							<li>
								<Button
									onClick={debugGallery.afterOnClick(layer)}
								>
									Debug Gallery
								</Button>
							</li>
							<li>
								<Button onClick={debugNav.afterOnClick(layer)}>
									Debug navigation
								</Button>
							</li>
							<li>
								<Button
									onClick={debugGamepad.afterOnClick(layer)}
								>
									Debug gamepad
								</Button>
							</li>
							<li>
								<Button
									onClick={compDebugPage.afterOnClick(layer)}
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
