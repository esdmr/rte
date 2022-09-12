import type {FunctionComponent} from 'preact';
import {lazy, Suspense} from 'preact/compat';
import {Loading} from './Loading.js';
import * as css from './Editor.module.css.js';

const Editor = /* @__PURE__ */ lazy(async () =>
	import('./Editor.js').then((mod) => mod.Editor),
);

export const EditorContainer: FunctionComponent = () => (
	<main class={css.editorContainer} role="region" aria-live="polite">
		<Suspense
			fallback={<Loading placement="bottom-right" class={css.editor} />}
		>
			<Editor />
		</Suspense>
	</main>
);
