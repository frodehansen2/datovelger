import * as React from 'react';
import Datovelger from './components/datovelger/Datovelger';
import * as moment from 'moment';
import { Moment } from 'moment';

import './styles/index.css';

interface Props {}

export interface State {
	dato: Date;
}

class App extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			dato: new Date()
		};
	}

	renderDag(d: Moment) {
		if (d.startOf('day').isSame(new Date(2018, 2, 19))) {
			return 'whoo';
		}
		return d.date();
	}
	render() {
		const date = moment();
		return (
			<div className="App">
				<div className="App__content">
					<h1>Testside for test av Airbnb sin datovelger</h1>
					<Datovelger
						id="datovelger"
						dato={this.state.dato}
						onChange={(dato) => this.setState({ dato })}
						avgrensninger={{
							minDato: date.add(-5, 'days').toDate(),
							maksDato: date.add(4, 'months').toDate(),
							helgedagerIkkeTillatt: true,
							ugyldigeTidsperioder: [
								{
									startdato: new Date(2018, 2, 15),
									sluttdato: new Date(2018, 2, 22)
								}
							]
						}}
					/>
				</div>
			</div>
		);
	}
}

export default App;
