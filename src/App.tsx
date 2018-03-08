import * as React from 'react';
import Datovelger from './components/datovelger/Datovelger';

import './App.css';

class App extends React.Component {
	render() {
		return (
			<div className="App">
				<h1>Testside for test av Airbnb sin datovelger</h1>
				<Datovelger />
			</div>
		);
	}
}

export default App;
