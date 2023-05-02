import type {FunctionComponent, TargetedEvent} from 'preact/compat';
import {useState, type StateUpdater} from 'preact/hooks';
import assert from '../assert.js';
import {NavRoot} from '../navigation/NavRoot.js';
import {Button} from '../navigation/wrappers.js';
import {NavRow} from '../navigation/NavRow.js';
import {NavColumn} from '../navigation/NavColumn.js';
import * as css from './debug.module.css';
import {CompDialog, createDialog} from './dialog.js';
import {useCompLayer, type CompLayer} from './layer.js';
import {CompPage, createPage} from './page.js';

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
	(
		layer: CompLayer,
		depth: number,
		setResult: StateUpdater<string | undefined>,
	) =>
	() => {
		const page = layer.findNearest(CompPage);
		assert(page, 'Not in a page');

		createDialog<string>({
			page,
			content: <CompDebugDialog depth={depth} />,
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

const openPage =
	(layer: CompLayer, depth: number, action?: 'replace') => () => {
		const page = layer.findNearest(CompPage);
		assert(page, 'Not in a page');

		createPage({
			page,
			replace: action === 'replace',
			content: <CompDebugPage depth={depth} />,
			classes: [css.page],
		});
	};

const closePage = (layer: CompLayer) => () => {
	const page = layer.findNearest(CompPage);
	assert(page, 'Not in a page');
	page.dispose();
};

const CompDebugDialog: FunctionComponent<{
	depth: number;
}> = ({depth}) => {
	const layer = useCompLayer();
	const [result, setResult] = useState<string>();

	return (
		<NavRoot>
			<article class={css.dialogContainer}>
				<h1>This is a dialog! (Depth is {depth})</h1>
				{result && <p>Dialog result was: {result}</p>}
				<NavColumn>
					<form onSubmit={resolveDialog(layer)}>
						<label>
							Dialog result: <input name="result" type="text" />
						</label>
						<Button>Resolve</Button>
					</form>
					<NavRow>
						<Button onClick={abortDialog(layer)}>Abort</Button>
						<Button
							onClick={openDialog(layer, depth + 1, setResult)}
						>
							Open dialog
						</Button>
						<Button onClick={openPage(layer, depth + 1)}>
							Open page
						</Button>
					</NavRow>
				</NavColumn>
			</article>
		</NavRoot>
	);
};

export const CompDebugPage: FunctionComponent<{
	depth?: number;
}> = ({depth = 0}) => {
	const layer = useCompLayer();
	const [result, setResult] = useState<string>();

	return (
		<NavRoot>
			<h1>Hello, World! (Depth is {depth})</h1>
			{result && <p>Dialog result was: {result}</p>}
			<NavRow>
				<Button onClick={closePage(layer)}>Back</Button>
				<Button onClick={openDialog(layer, depth + 1, setResult)}>
					Open dialog
				</Button>
				<Button onClick={openPage(layer, depth + 1)}>Open page</Button>
				<Button onClick={openPage(layer, depth, 'replace')}>
					Open page in-place
				</Button>
			</NavRow>
		</NavRoot>
	);
};

export const compDebugPageClass = css.page;
