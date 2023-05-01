import type {FunctionComponent} from 'preact';
import {lazy, Suspense} from 'preact/compat';
import {Loading} from './Loading.js';
import * as css from './Editor.module.css';

const Editor = /* @__PURE__ */ lazy(async () =>
	import('./Editor.js').then((mod) => mod.Editor),
);

const stopPropagation = (event: Event) => {
	event.stopPropagation();
};

export const EditorContainer: FunctionComponent = () => {
	return (
		<main
			class={css.editorContainer}
			role="region"
			aria-live="polite"
			onfocusin={stopPropagation}
			onGamepad={stopPropagation}
			onKeyDown={stopPropagation}
		>
			<Suspense
				fallback={
					<Loading placement="bottom-right" class={css.editor} />
				}
			>
				<Editor />
			</Suspense>
		</main>
	);
};
