import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import {FunctionComponent, h} from 'preact';
import {EffectCallback, MutableRef, Ref, useEffect, useRef} from 'preact/hooks';

declare global {
	// eslint-disable-next-line no-var
	var monaco: unknown;
}

globalThis.monaco = monaco;

type MonacoEditor = monaco.editor.IStandaloneCodeEditor;

const Editor: FunctionComponent<EditorProps> = props => {
	const ref = useRef<HTMLDivElement>(null);
	const editorRef = useRef<MonacoEditor>();

	useEffect(
		getEffectCallback(props, {
			ref,
			editorRef,
		}),
	);

	return <div ref={ref} class='editor'></div>;
};

interface EditorProps {
	accessibilityEnabled?: boolean;
}

function getEffectCallback(props: EditorProps, options: {
	ref: Ref<HTMLElement>;
	editorRef: MutableRef<MonacoEditor | undefined>;
}): EffectCallback {
	return () => {
		const controller = new AbortController();

		if (!options.ref.current) {
			throw new TypeError('Ref is null');
		}

		const element = options.ref.current;

		const editor = monaco.editor.create(element, {
			language: 'javascript',
			theme: 'vs-dark',
			fontFamily: '"System Mono"',
			fontLigatures: true,
			scrollBeyondLastLine: false,
			ariaContainerElement: element,
			accessibilitySupport: props.accessibilityEnabled ? 'on' : 'auto',
		});

		editor.layout({
			width: window.innerWidth,
			height: window.innerHeight,
		});

		window.addEventListener(
			'resize',
			() => {
				editor.layout({
					width: window.innerWidth,
					height: window.innerHeight,
				});
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

export default Editor;
