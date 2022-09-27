import type {FunctionComponent} from 'preact';
import {lazy, Suspense, useEffect, useMemo} from 'preact/compat';
import {Loading} from './Loading.js';
import * as css from './Editor.module.css.js';
import {pageStateContext, usePageState} from './page-state/global.js';
import {PageStateNode} from './page-state/node.js';
import {voidPageState} from './page-state/void.js';

const Editor = /* @__PURE__ */ lazy(async () =>
	import('./Editor.js').then((mod) => mod.Editor),
);

export const EditorContainer: FunctionComponent = () => {
	const parentPageState = usePageState();
	const pageState = useMemo(
		() => new PageStateNode(parentPageState, voidPageState),
		[parentPageState],
	);

	useEffect(() => {
		parentPageState.child = pageState;

		return () => {
			pageState.dispose();
		};
	}, [parentPageState]);

	return (
		<pageStateContext.Provider value={pageState}>
			<main class={css.editorContainer} role="region" aria-live="polite">
				<Suspense
					fallback={<Loading placement="bottom-right" class={css.editor} />}
				>
					<Editor />
				</Suspense>
			</main>
		</pageStateContext.Provider>
	);
};
