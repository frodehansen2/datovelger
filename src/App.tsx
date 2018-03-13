import * as React from 'react';
import * as moment from 'moment';

import { DatovelgerAvgrensninger } from './components/datovelger/types';
import { validerDato } from './components/datovelger/datovalidering';
// import Datovelger from './components/datovelger/Datovelger';
import Dagvelger from './components/dagvelger/Dagvelger';

import './styles/index.css';

interface Props {}

export interface State {
	dato: Date | null;
	inputValue: string;
	error: string | undefined;
	avgrensninger: DatovelgerAvgrensninger;
}

class App extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.oppdaterDato = this.oppdaterDato.bind(this);
		this.addDay = this.addDay.bind(this);
		this.state = {
			dato: null,
			inputValue: '',
			error: '',
			avgrensninger: {
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
			}
		};
	}

	handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.stopPropagation();
		e.preventDefault();
		alert('Valgt dato er: ' + this.state.dato);
	}

	oppdaterDato(dato: Date | null) {
		this.setState({
			dato,
			error: validerDato(dato, this.state.avgrensninger)
		});
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
					<h1>Datovelger basert på Airbnb react-dates </h1>
					<form action="#" onSubmit={this.handleSubmit}>
						<div className="datovelger">
							<div className="blokk-s">
								<label htmlFor="datoinput">Velg dato</label>
							</div>
							<Dagvelger
								inputId="datoinput"
								dato={this.state.dato || new Date()}
								velgDag={(d: Date) => this.oppdaterDato(d)}
								avgrensninger={this.state.avgrensninger}
								inputProps={{
									placeholder: 'dd.mm.åååå'
								}}
								ugyldigDagValgt={(d, validering) => {
									this.oppdaterDato(d);
								}}
							/>
							<hr />
						</div>
						<p>Valgt dato: {valgtDato}</p>
						<p>Validering: {this.state.error}</p>
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
