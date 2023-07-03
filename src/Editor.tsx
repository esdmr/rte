/* eslint-disable import/no-unassigned-import */
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js';
import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/browser/bracketMatching.js';
import 'monaco-editor/esm/vs/editor/contrib/wordHighlighter/browser/wordHighlighter.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import {type ComponentChild, Component} from 'preact';
import assert from './assert.js';
import type {Disposable} from './disposable.js';
import * as css from './Editor.module.css';

const lightTheme = 'vs-light';
const darkTheme = 'vs-dark';

export class MonacoEditor implements Disposable {
	private readonly _editor: monaco.editor.IStandaloneCodeEditor;
	private _lightTheme: boolean;

	get lightTheme(): boolean {
		return this._lightTheme;
	}

	set lightTheme(value: boolean) {
		this._lightTheme = value;
		this._editor.updateOptions({
			theme: this._getTheme(),
		});
	}

	private _forceAccessibility: boolean;

	get forceAccessibility(): boolean {
		return this._forceAccessibility;
	}

	set forceAccessibility(value: boolean) {
		this._forceAccessibility = value;
		this._editor.updateOptions({
			accessibilitySupport: this._getAccessibilitySupport(),
		});
	}

	constructor(
		private readonly _element: HTMLElement,
		options: {
			lightTheme: boolean;
			forceAccessibility: boolean;
		},
	) {
		this._lightTheme = options.lightTheme;
		this._forceAccessibility = options.forceAccessibility;

		const editor = monaco.editor.create(_element, {
			language: 'javascript',
			theme: this._getTheme(),
			fontFamily: '"System Mono"',
			fontLigatures: true,
			scrollBeyondLastLine: false,
			ariaContainerElement: _element,
			accessibilitySupport: this._getAccessibilitySupport(),
		});

		this._editor = editor;
		this.updateLayout();
	}

	updateLayout() {
		this._editor.layout();
	}

	dispose() {
		this._editor.getModel()?.dispose();
		this._editor.dispose();
		this._element.replaceChildren();
	}

	private _getTheme() {
		return this.lightTheme ? lightTheme : darkTheme;
	}

	private _getAccessibilitySupport() {
		return this.forceAccessibility ? 'on' : 'auto';
	}
}

type EditorProps = {
	forceAccessibility?: boolean;
	theme?: 'light' | 'dark' | 'auto';
};

export class Editor extends Component<EditorProps> {
	private _forceAccessibility = false;
	private _theme: EditorProps['theme'];
	private _editor?: MonacoEditor;
	private readonly _themeQuery = matchMedia('(prefers-color-scheme: light)');

	constructor(props?: EditorProps) {
		super(props);
		this._theme = props?.theme ?? 'auto';
		this._forceAccessibility = props?.forceAccessibility ?? false;
	}

	override componentWillReceiveProps(nextProps: Readonly<EditorProps>): void {
		const theme = nextProps.theme ?? 'auto';
		const forceAccessibility = nextProps.forceAccessibility ?? false;

		if (this._theme !== theme) {
			this._theme = theme;

			if (this._editor) {
				this._editor.lightTheme = this._isLightTheme();
			}
		}

		if (this._forceAccessibility !== forceAccessibility) {
			this._forceAccessibility = forceAccessibility;

			if (this._editor) {
				this._editor.forceAccessibility = forceAccessibility;
			}
		}
	}

	override shouldComponentUpdate(): boolean {
		return false;
	}

	override componentDidMount(): void {
		assert(this.base instanceof HTMLElement, 'base is not a HTMLElement');

		this._editor = new MonacoEditor(this.base, {
			forceAccessibility: this._forceAccessibility,
			lightTheme: this._isLightTheme(),
		});

		addEventListener('resize', this._onDidResize, {
			passive: true,
		});

		console.debug('Monaco editor started.');
	}

	override componentWillUnmount(): void {
		this._themeQuery.removeEventListener(
			'change',
			this._onDidThemeQueryChange,
		);
		removeEventListener('resize', this._onDidResize);
		this._editor?.dispose();
		this._editor = undefined;

		console.debug('monaco editor stopped.');
	}

	render(): ComponentChild {
		return <div class={css.editor} />;
	}

	private _isLightTheme() {
		this._themeQuery.removeEventListener(
			'change',
			this._onDidThemeQueryChange,
		);

		switch (this._theme) {
			case 'light': {
				return true;
			}

			case 'dark': {
				return false;
			}

			default: {
				this._themeQuery.addEventListener(
					'change',
					this._onDidThemeQueryChange,
					{
						passive: true,
					},
				);
				return this._themeQuery.matches;
			}
		}
	}

	private readonly _onDidResize = () => {
		assert(this._editor, 'editor is undefined');
		this._editor.updateLayout();
	};

	private readonly _onDidThemeQueryChange = (event: MediaQueryListEvent) => {
		assert(this._editor, 'editor is undefined');
		this._editor.lightTheme = event.matches;
	};
}
