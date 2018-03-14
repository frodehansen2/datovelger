import * as React from 'react';

import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';

import './styles/index.css';
import DayPickerDemo from './DayPickerDemo';
import ReactDatesDemo from './ReactDatesDemo';
import { Workbench } from './components/workbench/Workbench';

interface Props {}

class App extends React.Component<Props, {}> {
	render() {
		return (
			<div className="App">
				<div className="App__content">
					<div>
						<h1>Datovelger-test</h1>
						<ul className="meny">
							<li>
								<Link className="meny__element" to="daypicker">
									Datovelger 1: DayPicker
								</Link>
							</li>
							<li>
								<Link className="meny__element" to="reactdates">
									Datovelger 2: react-dates fra AirBnB
								</Link>
							</li>
						</ul>
					</div>

					<Switch>
						<Route component={Workbench} path="/workbench" />
						<Route component={DayPickerDemo} path="/daypicker" />
						<Route component={ReactDatesDemo} path="/reactdates" />
					</Switch>
				</div>
			</div>
		);
	}
}

export default App;
