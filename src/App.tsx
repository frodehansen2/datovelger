import * as React from 'react';
import Datovelger from './components/datovelger/Datovelger';
import * as moment from 'moment';

import './styles/index.css';

interface Props {}

export interface State {
	dato: Date | null;
}

class App extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.oppdaterDato = this.oppdaterDato.bind(this);
		this.addDay = this.addDay.bind(this);
		this.state = {
			dato: new Date()
		};
	}

	handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.stopPropagation();
		e.preventDefault();
		alert('Valgt dato er: ' + this.state.dato);
	}

	oppdaterDato(dato: Date | null) {
		console.log('oppdaterer', dato);
		this.setState({ dato });
	}

	addDay(days: number) {
		if (this.state.dato) {
			this.setState({
				dato: moment(this.state.dato)
					.add(days, 'days')
					.toDate()
			});
		}
	}

	render() {
		const { dato } = this.state;
		const valgtDato = dato ? dato.toDateString() : 'ingen gyldig dato valgt';

		return (
			<div className="App">
				<div className="App__content">
					<h1>Test av Airbnb react-dates</h1>
					<form action="#" onSubmit={this.handleSubmit}>
						<div className="datovelger">
							<Datovelger
								id="datovelger"
								dato={this.state.dato}
								onChange={this.oppdaterDato}
								avgrensninger={{
									minDato: moment()
										.add(-5, 'days')
										.toDate(),
									maksDato: moment()
										.add(4, 'months')
										.toDate(),
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
						<p>Valgt dato: {valgtDato}</p>
						<button type="submit" className="okButton">
							Ok
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default App;
