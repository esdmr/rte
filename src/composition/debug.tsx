import type {FunctionComponent, TargetedEvent} from 'preact/compat';
import {useMemo, useState, type StateUpdater} from 'preact/hooks';
import * as css from './debug.module.css';
import {createDialog, CompDialog} from './dialog.js';
import {CompWindow} from './window.js';
import {CompLayer, useCompNode} from './layer.js';
import {createPage, CompPage} from './page.js';

const useRandomId = () =>
	useMemo(() => Math.random().toString().slice(2, 10), []);

const resolveDialog =
	(dialog: CompDialog<string>) => (event: TargetedEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		dialog.result.resolve(form.get('result')?.toString() ?? '');
	};

const abortDialog = (dialog: CompDialog<any>) => () => {
	dialog.result.abort();
};

const openDialog =
	(page: CompPage, setResult: StateUpdater<string | undefined>) => () => {
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

const openPage = (page: CompPage, action?: 'replace') => () => {
	createPage({
		page,
		replace: action === 'replace',
		content: <Page />,
		classes: [css.page],
	});
};

const closePage = (page: CompPage) => () => {
	page.dispose();
};

const Dialog: FunctionComponent = () => {
	const dialog = useCompNode<CompDialog<string>>(CompDialog);
	const page = useCompNode(CompPage);
	const [result, setResult] = useState<string>();

	return (
		<article class={css.dialogContainer}>
			<h1>
				This is a dialog! (level ={' '}
				{page.dialogs.children.indexOf(dialog)}, randId ={' '}
				{useRandomId()})
			</h1>
			{result && <p>Dialog result was: {result}</p>}
			<form onSubmit={resolveDialog(dialog)}>
				<label>
					Dialog result: <input name="result" type="text" />
				</label>
				<button>Resolve</button>
			</form>
			<button onClick={abortDialog(dialog)}>Abort</button>
			<button onClick={openDialog(page, setResult)}>Open dialog</button>
			<button onClick={openPage(page)}>Open page</button>
		</article>
	);
};

const Page: FunctionComponent = () => {
	const page = useCompNode(CompPage);
	const window = useCompNode(CompWindow);
	const [result, setResult] = useState<string>();

	return (
		<>
			<h1>
				Hello, World! (level = {window.pages.children.indexOf(page)},
				randId = {useRandomId()})
			</h1>
			{result && <p>Dialog result was: {result}</p>}
			<button
				onClick={closePage(page)}
				disabled={window.pages.firstChild === page}
			>
				Back
			</button>
			<button onClick={openDialog(page, setResult)}>Open dialog</button>
			<button onClick={openPage(page)}>Open page</button>
			<button onClick={openPage(page, 'replace')}>
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
