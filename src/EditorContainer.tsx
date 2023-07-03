import type {FunctionComponent} from 'preact';
import {lazy, Suspense} from 'preact/compat';
import {Loading} from './Loading.js';
import * as css from './Editor.module.css';
import {CompPageBuilder} from './composition/page.js';
import {NavRoot} from './navigation/NavRoot.js';

const Editor = /* @__PURE__ */ lazy(async () =>
	import('./Editor.js').then((mod) => mod.Editor),
);

const stopPropagation = (event: Event) => {
	event.stopPropagation();
};

const EditorContainer: FunctionComponent = () => {
	return (
		<NavRoot>
			<main
				class={css.editorContainer}
				role="region"
				aria-live="polite"
				onfocusin={stopPropagation}
				onGamepad={stopPropagation}
				onKeyDown={stopPropagation}
				onInputGuideUpdate={stopPropagation}
			>
				<Suspense
					fallback={
						<Loading placement="bottom-right" class={css.editor} />
					}
				>
					<Editor />
				</Suspense>
			</main>
		</NavRoot>
	);
};

export const editorContainer = new CompPageBuilder(EditorContainer, {});
