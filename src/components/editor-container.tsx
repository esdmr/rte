import type {FunctionComponent} from 'preact';
import {lazy, Suspense} from 'preact/compat';
import {Loading} from './loading.js';
import * as css from './editor.module.css.js';

const Editor = /* @__PURE__ */ lazy(async () =>
	import('./editor.js').then(mod => mod.Editor),
);

export const EditorContainer: FunctionComponent = () => (
	<div class={css.editorContainer} role='region' aria-live='polite'>
		<Suspense fallback={<Loading placement='bottom-right' class={css.editor} />}>
			<Editor />
		</Suspense>
	</div>
);
