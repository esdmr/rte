import type {FunctionComponent, TargetedEvent} from 'preact/compat';
import {useMemo, useState, type StateUpdater} from 'preact/hooks';
import * as css from './debug.module.css.js';
import {
	createDialog,
	useCompositorDialog,
	type CompositorDialog,
} from './dialog.js';
import {
	CompositorGlobalGroup,
	useCompositorGlobalGroup,
} from './global-group.js';
import {CompositorLayer} from './layer.js';
import {createPage, useCompositorPage, type CompositorPage} from './page.js';

const useRandomId = () =>
	useMemo(() => Math.random().toString().slice(2, 10), []);

const resolveDialog =
	(dialog: CompositorDialog<string>) =>
	(event: TargetedEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		dialog.result.resolve(form.get('result')?.toString() ?? '');
	};

const abortDialog = (dialog: CompositorDialog<any>) => () => {
	dialog.result.abort();
};

const openDialog =
	(page: CompositorPage, setResult: StateUpdater<string | undefined>) =>
	() => {
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

const openPage = (page: CompositorPage, action?: 'replace') => () => {
	createPage({
		page,
		replace: action === 'replace',
		content: <Page />,
		classes: [css.page],
	});
};

const closePage = (page: CompositorPage) => () => {
	page.dispose();
};

const Dialog: FunctionComponent = () => {
	const dialog = useCompositorDialog<string>();
	const page = useCompositorPage();
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
	const page = useCompositorPage();
	const root = useCompositorGlobalGroup();
	const [result, setResult] = useState<string>();

	return (
		<>
			<h1>
				Hello, World! (level = {root.pages.children.indexOf(page)},
				randId = {useRandomId()})
			</h1>
			{result && <p>Dialog result was: {result}</p>}
			<button
				onClick={closePage(page)}
				disabled={root.pages.firstChild === page}
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

const root = new CompositorGlobalGroup(document.body);

const overlay = new CompositorLayer();
root.overlays.append(overlay);
overlay.classList.add(css.overlay);
overlay.render(<span>Just press the buttons, it’s easy!</span>);

createPage({
	root,
	content: <Page />,
	classes: [css.page],
});
