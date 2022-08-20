// eslint-disable-next-line n/file-extension-in-import, import/no-unassigned-import
import 'preact/debug';
import {h, render} from 'preact';
import App from './components/app.js';
import './index.css';

console.log('Test…');
render(<App/>, document.body);
