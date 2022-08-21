import {FunctionComponent, h} from 'preact';
import {lazy, Suspense} from 'preact/compat';
import EditorSpinner from './editor-spinner.js';

const MonacoEditor = lazy(async () =>
	import('./editor.js').then(mod => mod.default),
);

const EditorContainer: FunctionComponent = () => (
	<div class='editor-container' role='region' aria-live='polite'>
		<Suspense fallback={<EditorSpinner />}>
			<MonacoEditor />
		</Suspense>
	</div>
);

export default EditorContainer;
