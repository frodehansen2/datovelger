import * as React from 'react';
// import Chevron from 'nav-frontend-chevron';
import * as classnames from 'classnames';
import * as moment from 'moment';
import { DatovelgerAvgrensninger } from './types';
import { normaliserDato } from './utils';

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
import { validerDato, DatoValideringsfeil } from './datovalidering';
import KalenderKnapp from './elementer/KalenderKnapp';
import DomEventContainer from '../DomEventContainer';
import DatoInput from './DatoInput';
import AktivManed from './elementer/AktivManed';

interface State {
	måned?: Date | undefined;
	erÅpen?: boolean;
	statusMessage: string;
	inputValue: string;
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
	};
	/** Kalles når en ikke lovlig dato velges */
	onUnavailableDateClick?: (
		date: Date,
		validering?: DatoValideringsfeil
	) => void;
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
		this.onDayClick = this.onDayClick.bind(this);
		this.onMånedClick = this.onMånedClick.bind(this);
		this.toggleKalender = this.toggleKalender.bind(this);
		this.nesteMånedTilgjengelig = this.nesteMånedTilgjengelig.bind(this);
		this.forrigeMånedTilgjengelig = this.forrigeMånedTilgjengelig.bind(this);
		this.lukkKalender = this.lukkKalender.bind(this);
		this.formaterDayAriaLabel = this.formaterDayAriaLabel.bind(this);
		this.erDagTilgjengelig = this.erDagTilgjengelig.bind(this);
		this.state = {
			måned: props.dato || new Date(),
			erÅpen: true,
			statusMessage: '',
			inputValue: ''
		};
	}

	onDayClick(date: Date) {
		const { avgrensninger, onUnavailableDateClick } = this.props;
		if (onUnavailableDateClick && avgrensninger) {
			const datovalidering = validerDato(date, avgrensninger);
			if (datovalidering !== undefined) {
				onUnavailableDateClick(date, datovalidering);
				return;
			}
		}
		this.setState({
			statusMessage: `Valgt dag: ${moment(date).format('DD.MM.YYYY')}`,
			erÅpen: false,
			inputValue: moment(date).format('DD.MM.YYYY')
		});
		if (this.input) {
			this.input.focus();
		}
		this.props.velgDag(date);
	}

	onMånedClick(evt: React.MouseEvent<HTMLButtonElement>, retning: -1 | 1) {
		evt.preventDefault();
		evt.stopPropagation();
		const mnd = moment(this.state.måned)
			.add(retning, 'months')
			.toDate();
		this.setState({
			måned: mnd
		});
	}

	toggleKalender() {
		this.setState({ erÅpen: !this.state.erÅpen });
	}

	forrigeMånedTilgjengelig() {
		return (
			this.props.avgrensninger &&
			this.props.avgrensninger.minDato &&
			moment(this.state.måned).isAfter(this.props.avgrensninger.minDato)
		);
	}

	nesteMånedTilgjengelig() {
		return (
			this.props.avgrensninger &&
			this.props.avgrensninger.maksDato &&
			moment(this.state.måned).isBefore(this.props.avgrensninger.maksDato)
		);
	}

	lukkKalender() {
		this.setState({ erÅpen: false });
	}

	erDagTilgjengelig(dato: Date) {
		return validerDato(dato, this.props.avgrensninger || {}) === undefined;
	}

	formaterDayAriaLabel(dato: Date, locale: string) {
		let ariaLabel = moment(dato).format('DD.MM.YYYY (dddd)');
		if (this.props.avgrensninger) {
			if (!this.erDagTilgjengelig(dato)) {
				ariaLabel = ` (ikke tilgjengelig)`;
			}
		}
		return ariaLabel;
	}

	render() {
		const {
			dato = new Date(),
			locale = 'no',
			visUkenumre = false,
			inputProps
		} = this.props;

		const { erÅpen, inputValue } = this.state;

		const navbarElement = (
			<Navbar
				forrige={{
					label: `Gå til ${moment(this.state.måned)
						.add(-1, 'months')
						.format('MMMM')}`,
					disabled: !this.forrigeMånedTilgjengelig(),
					onClick: (evt) => this.onMånedClick(evt, -1)
				}}
				neste={{
					label: `Gå til ${moment(this.state.måned)
						.add(1, 'months')
						.format('MMMM')}`,
					disabled: !this.nesteMånedTilgjengelig(),
					onClick: (evt) => this.onMånedClick(evt, 1)
				}}
			/>
		);

		const localeUtils = {
			...momentLocaleUtils,
			formatDay: this.formaterDayAriaLabel
		};

		const innstillinger: DayPickerProps = {
			locale,
			localeUtils,
			navbarElement,
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
							ref={(c) => (this.input = c)}
							{...inputProps}
							value={inputValue}
						/>
						<KalenderKnapp onToggle={this.toggleKalender} />
					</div>
					{erÅpen && (
						<DayPicker
							month={this.state.måned}
							selectedDays={dato}
							onDayClick={this.onDayClick}
							onMonthChange={(month: Date) => this.setState({ måned: month })}
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
