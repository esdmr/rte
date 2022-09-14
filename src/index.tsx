// eslint-disable-next-line import/no-unassigned-import
import 'preact/debug';
import {createRef, render} from 'preact';
import {Router} from 'wouter-preact';
import {App} from './App.js';
import {NavRoot} from './navigation/NavRoot.js';
import './index.css';
import {useHashLocation} from './wouter-hash.js';
import type {NavNode} from './navigation/node.js';
import * as inputStack from './input/stack.js';
import {navInputMode} from './input/navigation.js';

const navRootRef = createRef<NavNode>();
inputStack.push(navInputMode(navRootRef));

render(
	<NavRoot nav-ref={navRootRef}>
		<Router hook={useHashLocation}>
			<App />
		</Router>
	</NavRoot>,
	document.body,
);
