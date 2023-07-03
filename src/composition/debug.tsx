import type {FunctionComponent, TargetedEvent} from 'preact/compat';
import {useState, type StateUpdater} from 'preact/hooks';
import assert from '../assert.js';
import {NavColumn} from '../navigation/NavColumn.js';
import {NavRoot} from '../navigation/NavRoot.js';
import {NavRow} from '../navigation/NavRow.js';
import {Button} from '../navigation/wrappers.js';
import {CloseButton} from './CloseButton.js';
import * as css from './debug.module.css';
import {CompDialog, CompDialogBuilder} from './dialog.js';
import {useCompLayer, type CompLayer} from './layer.js';
import {CompPage, CompPageBuilder} from './page.js';

const resolveDialog =
	(layer: CompLayer) => (event: TargetedEvent<HTMLFormElement>) => {
		event.preventDefault();
		const dialog = layer.findNearest(CompDialog);
		assert(dialog, 'Not in a dialog');
		const form = new FormData(event.currentTarget);
		dialog.result.resolve(form.get('result')?.toString() ?? '');
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

		compDebugDialog.append(page, {depth}).result.promise.then(
			(value) => {
				setResult(`resolved: ${value}`);
			},
			(error) => {
				setResult(`rejected: ${String(error)}`);
			},
		);
	};

const CompDebugDialog: FunctionComponent<{
	depth: number;
}> = ({depth}) => {
	const layer = useCompLayer();
	const [result, setResult] = useState<string>();

	return (
		<article class={css.dialogContainer}>
			<NavRoot name="CompDebugDialog">
				<nav>
					<CloseButton />
				</nav>
				<main>
					<h1>This is a dialog! (Depth is {depth})</h1>
					{result && <p>Dialog result was: {result}</p>}
					<NavColumn>
						<form onSubmit={resolveDialog(layer)}>
							<label>
								Dialog result:{' '}
								<input name="result" type="text" />
							</label>
							<Button>Resolve</Button>
						</form>
						<NavRow>
							<Button
								onClick={openDialog(
									layer,
									depth + 1,
									setResult,
								)}
							>
								Open dialog
							</Button>
							<Button
								onClick={compDebugPage.afterOnClick(layer, {
									depth: depth + 1,
								})}
							>
								Open page
							</Button>
						</NavRow>
					</NavColumn>
				</main>
			</NavRoot>
		</article>
	);
};

const CompDebugPage: FunctionComponent<{
	depth: number;
	replaced?: boolean;
}> = ({depth, replaced}) => {
	const layer = useCompLayer();
	const [result, setResult] = useState<string>();

	return (
		<NavRoot name="CompDebugPage">
			<header>
				<nav>
					<CloseButton />
				</nav>
			</header>
			<main>
				<h1>
					Hello, World! (Depth is {depth}, Replaced:{' '}
					{String(replaced)})
				</h1>
				{result && <p>Dialog result was: {result}</p>}
				<NavRow>
					<Button onClick={openDialog(layer, depth + 1, setResult)}>
						Open dialog
					</Button>
					<Button
						onClick={compDebugPage.afterOnClick(layer, {
							depth: depth + 1,
						})}
					>
						Open page
					</Button>
					<Button
						onClick={compDebugPage.replaceOnClick(layer, {
							depth,
							replaced: true,
						})}
					>
						Open page in-place
					</Button>
				</NavRow>
			</main>
		</NavRoot>
	);
};

const compDebugDialog = new CompDialogBuilder(CompDebugDialog, {
	depth: 0,
}).withType<string>();
compDebugDialog.classList.push(css.dialog);

export const compDebugPage = new CompPageBuilder(CompDebugPage, {
	depth: 0,
	replaced: false,
});
