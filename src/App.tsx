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
		this.onClose = this.onClose.bind(this);
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

	oppdaterDato(dato: Date | null, inputValue: string) {
		this.setState({
			dato,
			inputValue,
			error: validerDato(dato || inputValue, this.state.avgrensninger)
		});
	}

	onClose(dato: Date, inputValue: string) {
		console.log('App.onBlur', dato, `[${inputValue}]`);
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
						<p>
							Min dato:{' '}
							{moment(this.state.avgrensninger.minDato).toLocaleString()}
						</p>
						<p>
							Maks dato:{' '}
							{moment(this.state.avgrensninger.maksDato).toLocaleString()}
						</p>
						<div className="datovelger">
							{/* <Datovelger
								id="datovelger"
								dato={this.state.dato}
								onChange={this.oppdaterDato}
								avgrensninger={this.state.avgrensninger}
							/> */}
							<hr />
							<Dagvelger
								dato={this.state.dato || new Date()}
								velgDag={(d: Date) => this.oppdaterDato(d, '')}
								avgrensninger={this.state.avgrensninger}
								inputProps={{
									id: 'hwoa',
									placeholder: 'dd.mm.åååå'
								}}
								ugyldigDagValgt={(d, validering) => {
									console.log('Ugyldig dato', d, validering);
								}}
							/>
							<hr />
						</div>
						<p>Valgt dato: {valgtDato}</p>
						<p>Input-verdi: {this.state.inputValue}</p>
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
