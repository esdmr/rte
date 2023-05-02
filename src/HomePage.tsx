import type {FunctionComponent} from 'preact';
import {Link} from './Link.js';
import {AllowScroll} from './AllowScroll.js';
import {NavColumn} from './navigation/NavColumn.js';
import {Button} from './navigation/wrappers.js';
import {useCompLayer} from './composition/layer.js';
import {CompWindow} from './composition/window.js';
import {createPage} from './composition/page.js';
import {CompDebugPage, compDebugPageClass} from './composition/debug.js';

export const HomePage: FunctionComponent = () => {
	const layer = useCompLayer();

	return (
		<>
			<header aria-hidden />
			<main>
				<AllowScroll />
				<h1>RTE</h1>
				<p>Work in progress!</p>
				<nav>
					<ul>
						<NavColumn>
							<li>
								<Link href="/debug/editor">Debug Editor</Link>
							</li>
							<li>
								<Link href="/debug/licenses">
									Debug Licenses
								</Link>
							</li>
							<li>
								<Link href="/debug/gallery">Debug Gallery</Link>
							</li>
							<li>
								<Link href="/debug/route/init">
									Debug routes
								</Link>
							</li>
							<li>
								<Link href="/debug/nav">Debug navigation</Link>
							</li>
							<li>
								<Link href="/debug/gamepad">Debug gamepad</Link>
							</li>
							<li>
								<Button
									onClick={() => {
										const window =
											layer.findNearest(CompWindow);

										createPage({
											window,
											content: <CompDebugPage />,
											classes: [compDebugPageClass],
										});
									}}
								>
									Debug compositor
								</Button>
							</li>
						</NavColumn>
					</ul>
				</nav>
			</main>
		</>
	);
};
