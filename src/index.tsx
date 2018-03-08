import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

import 'moment/locale/nb';
import 'react-dates/initialize';

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
