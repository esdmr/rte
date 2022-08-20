import {FunctionComponent, h} from 'preact';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

const MonacoEditor: FunctionComponent = () => <div ref={ref => {
	if (!ref) {
		throw new Error('Ref is null');
	}

	const editor = monaco.editor.create(ref, {
		language: 'javascript',
	});

	window.addEventListener('resize', () => {
		editor.layout({width: ref.clientWidth, height: ref.clientHeight});
	});
}} class='monaco-editor'></div>;

export default MonacoEditor;
