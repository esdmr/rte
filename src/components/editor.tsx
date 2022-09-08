/* eslint-disable import/no-unassigned-import */
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js';
import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/browser/bracketMatching.js';
import 'monaco-editor/esm/vs/editor/contrib/wordHighlighter/browser/wordHighlighter.js';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import type {FunctionComponent} from 'preact';
import {
	type EffectCallback,
	type MutableRef,
	type Ref,
	useEffect,
	useRef,
} from 'preact/hooks';
import assert from '../assert.js';
import * as css from './editor.module.css.js';

declare global {
	// eslint-disable-next-line no-var
	var monaco: unknown;
}

// Debug: globalThis.monaco = monaco;
type MonacoEditor = monaco.editor.IStandaloneCodeEditor;

export const Editor: FunctionComponent<EditorProps> = (props) => {
	const ref = useRef<HTMLDivElement>(null);
	const editorRef = useRef<MonacoEditor>();

	useEffect(
		getEffectCallback(props, {
			ref,
			editorRef,
		}),
	);

	return <div ref={ref} class={css.editor}></div>;
};

type EditorProps = {
	accessibilityEnabled?: boolean;
	lightTheme?: string;
	darkTheme?: string;
	theme?: 'light' | 'dark' | 'auto';
};

function getEffectCallback(
	props: EditorProps,
	options: {
		ref: Ref<HTMLElement>;
		editorRef: MutableRef<MonacoEditor | undefined>;
	},
): EffectCallback {
	return () => {
		const controller = new AbortController();
		assert(options.ref.current !== null, 'ref is null');
		const element = options.ref.current;

		props.lightTheme ??= 'vs-light';
		props.darkTheme ??= 'vs-dark';
		props.theme ??= 'auto';
		let theme: string;

		switch (props.theme) {
			case 'light':
				theme = props.lightTheme;
				break;

			case 'dark':
				theme = props.darkTheme;
				break;

			case 'auto': {
				const prefersColorScheme = matchMedia(
					'(prefers-color-scheme: light)',
				).matches;
				theme = prefersColorScheme ? props.lightTheme : props.darkTheme;
				break;
			}

			default:
				throw new Error('Invalid theme name');
		}

		const editor = monaco.editor.create(element, {
			language: 'javascript',
			theme,
			fontFamily: '"System Mono"',
			fontLigatures: true,
			scrollBeyondLastLine: false,
			ariaContainerElement: element,
			accessibilitySupport: props.accessibilityEnabled ? 'on' : 'auto',
		});

		editor.layout();

		if (props.theme === 'auto') {
			matchMedia('(prefers-color-scheme: light)').addEventListener(
				'change',
				(event) => {
					monaco.editor.setTheme(
						event.matches ? props.lightTheme! : props.darkTheme!,
					);
				},
				{signal: controller.signal},
			);
		}

		addEventListener(
			'resize',
			() => {
				editor.layout();
			},
			{signal: controller.signal},
		);

		controller.signal.addEventListener('abort', () => {
			editor.getModel()?.dispose();
			editor.dispose();
			element.replaceChildren();
		});

		options.editorRef.current = editor;
		console.log('Monaco editor started.');

		return () => {
			controller.abort();
			console.log('monaco editor stopped.');
			options.editorRef.current = undefined;
		};
	};
}
