import * as React from 'react';
import { Switch, Route } from 'react-router';
import DayPickerDemo from './DayPickerDemo';
import { Workbench } from './components/workbench/Workbench';
import './styles/index.css';

interface Props {}

class App extends React.Component<Props, {}> {
	render() {
		return (
			<div className="App">
				<div className="App__content">
					<div>
						<h1>Datovelger-test</h1>
					</div>
					<Switch>
						<Route component={Workbench} path="/workbench" />
						<Route component={DayPickerDemo} path="/daypicker" />
					</Switch>
				</div>
			</div>
		);
	}
}

export default App;
