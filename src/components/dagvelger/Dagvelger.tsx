import * as React from 'react';
import * as classnames from 'classnames';
import { DatovelgerAvgrensninger } from './types';
import {
	normaliserDato,
	formaterDayAriaLabel,
	formatDateInputValue
} from './utils';

/** Denner foreløpig ikke registert riktig i forhold til typings */
const momentLocaleUtils = require('react-day-picker/moment');

import DayPicker, {
	DayPickerProps,
	Modifier,
	RangeModifier,
	AfterModifier,
	BeforeModifier,
	DaysOfWeekModifier
} from 'react-day-picker';
import '../../../node_modules/react-day-picker/lib/style.css';
import Navbar from './Navbar';
import { validerDato, DatoValidering } from './utils/datovalidering';
import KalenderKnapp from './elementer/KalenderKnapp';
import DomEventContainer from '../DomEventContainer';
import DatoInput from './DatoInput';
import AktivManed from './elementer/AktivManed';

interface State {
	måned: Date;
	erÅpen?: boolean;
	statusMessage: string;
}

export interface Props {
	/** Valgt dato */
	dato?: Date;
	/** Begrensninger på hvilke datoer bruker kan velge */
	avgrensninger?: DatovelgerAvgrensninger;
	/** Kalles når en dato velges */
	velgDag: (date: Date) => void;
	/** Input props */
	inputProps?: {
		id: string;
		placeholder?: string;
		required?: boolean;
		ariaDescribedby?: string;
	};
	/** Kalles når en ikke lovlig dato velges */
	ugyldigDagValgt?: (date: Date, validering?: DatoValidering) => void;
	/** Språk - default no */
	locale?: 'no';
	/** Om ukenumre skal vises - default false */
	visUkenumre?: boolean;
}

const mapProps = (props: Props): DayPickerProps => {
	const { avgrensninger } = props;

	if (avgrensninger) {
		let ugyldigeDager: Modifier[] = [];
		if (avgrensninger.ugyldigeTidsperioder) {
			ugyldigeDager = avgrensninger.ugyldigeTidsperioder.map(
				(t): RangeModifier => {
					return {
						from: t.startdato,
						to: t.sluttdato
					};
				}
			);
		}
		const minDato =
			avgrensninger.minDato && normaliserDato(avgrensninger.minDato);
		const maksDato =
			avgrensninger.maksDato && normaliserDato(avgrensninger.maksDato);
		const helgedager = {
			daysOfWeek: avgrensninger.helgedagerIkkeTillatt ? [0, 6] : []
		};
		return {
			disabledDays: [
				...ugyldigeDager,
				...(maksDato ? [{ after: maksDato.toDate() } as AfterModifier] : []),
				...(minDato ? [{ before: minDato.toDate() } as BeforeModifier] : []),
				...[helgedager as DaysOfWeekModifier]
			]
		};
	}
	return {};
};

class Dagvelger extends React.Component<Props, State> {
	input: DatoInput | null;

	constructor(props: Props) {
		super(props);
		this.onVelgDag = this.onVelgDag.bind(this);
		this.onByttMåned = this.onByttMåned.bind(this);
		this.onDatoInputChange = this.onDatoInputChange.bind(this);
		this.toggleKalender = this.toggleKalender.bind(this);
		this.lukkKalender = this.lukkKalender.bind(this);
		this.validerDato = this.validerDato.bind(this);
		this.state = {
			måned: props.dato || new Date(),
			erÅpen: false,
			statusMessage: ''
		};
	}

	componentWillReceiveProps(nextProps: Props) {
		console.log(nextProps);
	}

	validerDato(dato: Date): DatoValidering {
		if (this.props.avgrensninger) {
			return validerDato(dato, this.props.avgrensninger);
		}
		return 'gyldig';
	}

	onVelgDag(dato: Date) {
		const datovalidering = this.validerDato(dato);
		if (datovalidering === 'gyldig') {
			this.setState({
				statusMessage: `Valgt dag: ${formatDateInputValue(dato)}`,
				erÅpen: false
			});
			if (this.input) {
				this.input.focus();
			}
			this.props.velgDag(dato);
		} else if (this.props.ugyldigDagValgt) {
			this.props.ugyldigDagValgt(dato, datovalidering);
		}
	}

	onDatoInputChange(dato: Date) {
		const datovalidering = this.validerDato(dato);
		if (datovalidering === 'gyldig') {
			this.setState({
				statusMessage: `Valgt dag: ${formatDateInputValue(dato)}`,
				erÅpen: false
			});
			this.props.velgDag(dato);
		} else if (this.props.ugyldigDagValgt) {
			this.props.ugyldigDagValgt(dato, datovalidering);
		}
	}

	onByttMåned(måned: Date) {
		this.setState({
			måned
		});
	}

	toggleKalender() {
		this.setState({ erÅpen: !this.state.erÅpen });
	}

	lukkKalender() {
		this.setState({ erÅpen: false });
	}

	render() {
		const {
			dato = new Date(),
			locale = 'no',
			visUkenumre = false,
			inputProps
		} = this.props;

		const { måned, erÅpen } = this.state;

		const localeUtils = {
			...momentLocaleUtils,
			formatDay: (d: Date, l: string) =>
				formaterDayAriaLabel(d, l, this.props.avgrensninger)
		};

		const innstillinger: DayPickerProps = {
			locale,
			localeUtils,
			navbarElement: (
				<Navbar
					måned={måned}
					byttMåned={(d: Date) => this.onByttMåned(d)}
					avgrensninger={this.props.avgrensninger}
				/>
			),
			captionElement: (
				<AktivManed date={dato} locale={locale} localeUtils={localeUtils} />
			),
			firstDayOfWeek: 1,
			showWeekNumbers: visUkenumre
		};

		return (
			<DomEventContainer onBlur={() => this.lukkKalender()}>
				<div className={classnames('nav-dagvelger')}>
					<div className="nav-dagvelger__inputContainer blokk-s">
						<DatoInput
							{...inputProps}
							ref={(c) => (this.input = c)}
							date={this.props.dato}
							onDateChange={this.onDatoInputChange}
						/>
						<KalenderKnapp
							onToggle={this.toggleKalender}
							erÅpen={erÅpen || false}
						/>
					</div>
					{erÅpen && (
						<DayPicker
							fromMonth={
								this.props.avgrensninger
									? this.props.avgrensninger.minDato
									: undefined
							}
							toMonth={
								this.props.avgrensninger
									? this.props.avgrensninger.maksDato
									: undefined
							}
							month={this.state.måned}
							selectedDays={dato}
							onDayClick={this.onVelgDag}
							onMonthChange={this.onByttMåned}
							{...innstillinger}
							{...mapProps(this.props)}
						/>
					)}
				</div>
			</DomEventContainer>
		);
	}
}

export default Dagvelger;
