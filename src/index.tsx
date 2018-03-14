import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

import 'moment/locale/nb';
import 'react-dates/initialize';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

ReactDOM.render(
	<Router history={history}>
		<App />
	</Router>,
	document.getElementById('root') as HTMLElement
);
