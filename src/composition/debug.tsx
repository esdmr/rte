import type {FunctionComponent, TargetedEvent} from 'preact/compat';
import {useState, type StateUpdater} from 'preact/hooks';
import assert from '../assert.js';
import * as css from './debug.module.css';
import {createDialog, CompDialog} from './dialog.js';
import {CompWindow} from './window.js';
import {CompLayer, useCompLayer} from './layer.js';
import {createPage, CompPage} from './page.js';

const resolveDialog =
	(layer: CompLayer) => (event: TargetedEvent<HTMLFormElement>) => {
		event.preventDefault();
		const dialog = layer.findNearest(CompDialog);
		assert(dialog, 'Not in a dialog');
		const form = new FormData(event.currentTarget);
		dialog.result.resolve(form.get('result')?.toString() ?? '');
	};

const abortDialog = (layer: CompLayer) => () => {
	const dialog = layer.findNearest(CompDialog);
	assert(dialog, 'Not in a dialog');
	dialog.result.abort();
};

const openDialog =
	(layer: CompLayer, setResult: StateUpdater<string | undefined>) => () => {
		const page = layer.findNearest(CompPage);
		assert(page, 'Not in a page');

		createDialog<string>({
			page,
			content: <Dialog />,
			classes: [css.dialog],
		}).result.promise.then(
			(value) => {
				setResult(`resolved: ${value}`);
			},
			(error) => {
				setResult(`rejected: ${String(error)}`);
			},
		);
	};

const openPage = (layer: CompLayer, action?: 'replace') => () => {
	const page = layer.findNearest(CompPage);
	assert(page, 'Not in a page');

	createPage({
		page,
		replace: action === 'replace',
		content: <Page />,
		classes: [css.page],
	});
};

const closePage = (layer: CompLayer) => () => {
	const page = layer.findNearest(CompPage);
	assert(page, 'Not in a page');
	page.dispose();
};

const Dialog: FunctionComponent = () => {
	const layer = useCompLayer();
	const [result, setResult] = useState<string>();

	return (
		<article class={css.dialogContainer}>
			<h1>This is a dialog!</h1>
			{result && <p>Dialog result was: {result}</p>}
			<form onSubmit={resolveDialog(layer)}>
				<label>
					Dialog result: <input name="result" type="text" />
				</label>
				<button>Resolve</button>
			</form>
			<button onClick={abortDialog(layer)}>Abort</button>
			<button onClick={openDialog(layer, setResult)}>Open dialog</button>
			<button onClick={openPage(layer)}>Open page</button>
		</article>
	);
};

const Page: FunctionComponent = () => {
	const layer = useCompLayer();
	const [result, setResult] = useState<string>();

	return (
		<>
			<h1>Hello, World!</h1>
			{result && <p>Dialog result was: {result}</p>}
			<button onClick={closePage(layer)}>Back</button>
			<button onClick={openDialog(layer, setResult)}>Open dialog</button>
			<button onClick={openPage(layer)}>Open page</button>
			<button onClick={openPage(layer, 'replace')}>
				Open page in-place
			</button>
		</>
	);
};

const window = new CompWindow(document.body);

const overlay = new CompLayer();
window.overlays.append(overlay);
overlay.classList.add(css.overlay);
overlay.render(<span>Just press the buttons, it’s easy!</span>);

createPage({
	window,
	content: <Page />,
	classes: [css.page],
});
