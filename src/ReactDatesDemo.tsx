import * as React from 'react';
import * as moment from 'moment';

import { DatovelgerAvgrensninger } from './components/datovelger/types';
import { validerDato } from './components/datovelger/datovalidering';

import './styles/index.css';

import Datovelger from './components/datovelger/Datovelger';

interface Props {}

export interface State {
	dato: Date | null;
	inputValue: string;
	error: string | undefined;
	avgrensninger: DatovelgerAvgrensninger;
}

class ReactDatesDemo extends React.Component<Props, State> {
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
					.add(24, 'months')
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
			<fieldset>
				<legend>Datovelger 2: Airbnb react-dates</legend>
				<form action="#" onSubmit={this.handleSubmit}>
					<div className="datovelger">
						<div className="blokk-s">
							<label htmlFor="datoinput">Velg dato</label>
						</div>
						<Datovelger
							id="datovelger"
							dato={this.state.dato}
							onChange={this.oppdaterDato}
							avgrensninger={this.state.avgrensninger}
						/>
					</div>
					<p>Valgt dato: {valgtDato}</p>
					<p>Validering: {this.state.error}</p>
					<button type="submit" className="okButton">
						Ok
					</button>
				</form>
			</fieldset>
		);
	}
}

export default ReactDatesDemo;
