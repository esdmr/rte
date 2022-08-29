import type {FunctionComponent} from 'preact';
import {Route, Router, Switch} from 'wouter-preact';
import {useHashLocation} from '../wouter-hash.js';
import {Debug} from './debug.js';
import {Link} from './link.js';
import {Title} from './title.js';

export const App: FunctionComponent = () => <Router hook={useHashLocation}>
	<Switch>
		<Route path='/'>{() => <Debug />}</Route>
		<Route path='/test/:id'>
			{({id}) => <>
				<Title>Page: {id}</Title>
				<h1>You are at {id}</h1>
				<ul>
					<li><Link href='/test/a'>absolute path a</Link></li>
					<li><Link href='/test/b'>absolute path b</Link></li>
				</ul>
			</>}
		</Route>
		<Route>
			<Title>Not found</Title>
			<h1>Page not found!</h1>
		</Route>
	</Switch>
</Router>;
