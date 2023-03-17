/* eslint-disable import/no-unassigned-import */
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js';
import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/browser/bracketMatching.js';
import 'monaco-editor/esm/vs/editor/contrib/wordHighlighter/browser/wordHighlighter.js';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import {type ComponentChild, Component} from 'preact';
import assert from './assert.js';
import type {Disposable} from './disposable.js';
import * as css from './Editor.module.css.js';

const lightTheme = 'vs-light';
const darkTheme = 'vs-dark';

export class MonacoEditor implements Disposable {
	private readonly editor: monaco.editor.IStandaloneCodeEditor;
	private _lightTheme: boolean;

	get lightTheme(): boolean {
		return this._lightTheme;
	}

	set lightTheme(value: boolean) {
		this._lightTheme = value;
		this.editor.updateOptions({
			theme: this.getTheme(),
		});
	}

	private _forceAccessibility: boolean;

	get forceAccessibility(): boolean {
		return this._forceAccessibility;
	}

	set forceAccessibility(value: boolean) {
		this._forceAccessibility = value;
		this.editor.updateOptions({
			accessibilitySupport: this.getAccessibilitySupport(),
		});
	}

	constructor(
		private readonly element: HTMLElement,
		options: {
			lightTheme: boolean;
			forceAccessibility: boolean;
		},
	) {
		this._lightTheme = options.lightTheme;
		this._forceAccessibility = options.forceAccessibility;

		const editor = monaco.editor.create(element, {
			language: 'javascript',
			theme: this.getTheme(),
			fontFamily: '"System Mono"',
			fontLigatures: true,
			scrollBeyondLastLine: false,
			ariaContainerElement: element,
			accessibilitySupport: this.getAccessibilitySupport(),
		});

		this.editor = editor;
		this.updateLayout();
	}

	updateLayout() {
		this.editor.layout();
	}

	dispose() {
		this.editor.getModel()?.dispose();
		this.editor.dispose();
		this.element.replaceChildren();
	}

	private getTheme() {
		return this.lightTheme ? lightTheme : darkTheme;
	}

	private getAccessibilitySupport() {
		return this.forceAccessibility ? 'on' : 'auto';
	}
}

type EditorProps = {
	forceAccessibility?: boolean;
	theme?: 'light' | 'dark' | 'auto';
};

export class Editor extends Component<EditorProps> {
	private forceAccessibility = false;
	private theme: EditorProps['theme'];
	private editor?: MonacoEditor | undefined;
	private readonly themeQuery = matchMedia('(prefers-color-scheme: light)');

	constructor(props?: EditorProps) {
		super(props);
		this.theme = props?.theme ?? 'auto';
		this.forceAccessibility = props?.forceAccessibility ?? false;
	}

	override componentWillReceiveProps(nextProps: Readonly<EditorProps>): void {
		const theme = nextProps.theme ?? 'auto';
		const forceAccessibility = nextProps.forceAccessibility ?? false;

		if (this.theme !== theme) {
			this.theme = theme;

			if (this.editor) {
				this.editor.lightTheme = this.isLightTheme();
			}
		}

		if (this.forceAccessibility !== forceAccessibility) {
			this.forceAccessibility = forceAccessibility;

			if (this.editor) {
				this.editor.forceAccessibility = forceAccessibility;
			}
		}
	}

	override shouldComponentUpdate(): boolean {
		return false;
	}

	override componentDidMount(): void {
		assert(this.base instanceof HTMLElement, 'base is not a HTMLElement');

		this.editor = new MonacoEditor(this.base, {
			forceAccessibility: this.forceAccessibility,
			lightTheme: this.isLightTheme(),
		});

		addEventListener('resize', this.onDidResize, {
			passive: true,
		});

		console.debug('Monaco editor started.');
	}

	override componentWillUnmount(): void {
		this.themeQuery.removeEventListener(
			'change',
			this.onDidThemeQueryChange,
		);
		removeEventListener('resize', this.onDidResize);
		this.editor?.dispose();
		this.editor = undefined;

		console.debug('monaco editor stopped.');
	}

	render(): ComponentChild {
		return <div class={css.editor} />;
	}

	private isLightTheme() {
		this.themeQuery.removeEventListener(
			'change',
			this.onDidThemeQueryChange,
		);

		switch (this.theme) {
			case 'light': {
				return true;
			}

			case 'dark': {
				return false;
			}

			default: {
				this.themeQuery.addEventListener(
					'change',
					this.onDidThemeQueryChange,
					{
						passive: true,
					},
				);
				return this.themeQuery.matches;
			}
		}
	}

	private readonly onDidResize = () => {
		assert(this.editor, 'editor is undefined');
		this.editor.updateLayout();
	};

	private readonly onDidThemeQueryChange = (event: MediaQueryListEvent) => {
		assert(this.editor, 'editor is undefined');
		this.editor.lightTheme = event.matches;
	};
}
