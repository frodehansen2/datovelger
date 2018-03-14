import * as React from 'react';
import * as classnames from 'classnames';
import { guid } from 'nav-frontend-js-utils';

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
import AvgrensningerInfo from './elementer/AvgrensningerInfo';

interface State {
	måned: Date;
	datovalidering: DatoValidering;
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
	/** Påkrevd id til inputfelt */
	id: string;
	/** Input props */
	inputProps?: {
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

const focusOnDayPicker = (daypickerWrapper: HTMLElement) => {
	const selectedDay = daypickerWrapper.querySelector(
		'.DayPicker-Day--selected'
	) as HTMLElement;
	const availableDay = daypickerWrapper.querySelector(
		'.DayPicker-Day[aria-disabled=false],.DayPicker-Day--today'
	) as HTMLElement;
	if (selectedDay) {
		selectedDay.focus();
	} else if (availableDay) {
		availableDay.focus();
	} else {
		daypickerWrapper.focus();
	}
};

class Dagvelger extends React.Component<Props, State> {
	input: DatoInput | null;
	setFocusOnCalendar: boolean;
	id: string;
	daypickerWrapper: HTMLDivElement | null;

	constructor(props: Props) {
		super(props);

		this.id = guid();

		this.onVelgDag = this.onVelgDag.bind(this);
		this.onByttMåned = this.onByttMåned.bind(this);
		this.onDatoDateChange = this.onDatoDateChange.bind(this);
		this.toggleKalender = this.toggleKalender.bind(this);
		this.lukkKalender = this.lukkKalender.bind(this);

		this.state = {
			måned: props.dato || new Date(),
			datovalidering: props.dato
				? validerDato(props.dato, props.avgrensninger || {})
				: 'datoErIkkeDefinert',
			erÅpen: false,
			statusMessage: ''
		};
	}

	componentWillReceiveProps(nextProps: Props) {
		this.setState({
			datovalidering: validerDato(nextProps.dato, nextProps.avgrensninger || {})
		});
	}

	onVelgDag(dato: Date) {
		const datovalidering = validerDato(dato, this.props.avgrensninger || {});
		if (datovalidering === 'gyldig') {
			this.setState({
				statusMessage: `Valgt dag: ${formatDateInputValue(dato)}`,
				erÅpen: false,
				datovalidering
			});
			if (this.input) {
				this.input.focus();
			}
			this.props.velgDag(dato);
		} else if (this.props.ugyldigDagValgt) {
			this.props.ugyldigDagValgt(dato, datovalidering);
			this.setState({ datovalidering });
		}
	}

	onDatoDateChange(dato: Date) {
		const datovalidering = validerDato(dato, this.props.avgrensninger || {});
		if (datovalidering === 'gyldig') {
			this.setState({
				statusMessage: `Valgt dag: ${formatDateInputValue(dato)}`,
				erÅpen: false,
				datovalidering
			});
			this.props.velgDag(dato);
		} else if (this.props.ugyldigDagValgt) {
			this.props.ugyldigDagValgt(dato, datovalidering);
			this.setState({ datovalidering });
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

	componentDidUpdate(prevProps: Props, prevState: State) {
		if (!prevState.erÅpen && this.state.erÅpen && this.daypickerWrapper) {
			focusOnDayPicker(this.daypickerWrapper);
		}
	}

	render() {
		const {
			dato,
			id,
			locale = 'no',
			visUkenumre = false,
			inputProps,
			avgrensninger
		} = this.props;

		const { måned, erÅpen, datovalidering } = this.state;

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
				<AktivManed date={måned} locale={locale} localeUtils={localeUtils} />
			),
			firstDayOfWeek: 1,
			showWeekNumbers: visUkenumre
		};

		const avgrensningerInfoId = avgrensninger ? `${this.id}_srDesc` : undefined;
		const invalidDate = datovalidering !== 'gyldig';

		return (
			<DomEventContainer onBlur={() => this.lukkKalender()}>
				<div className={classnames('nav-dagvelger')}>
					{avgrensninger &&
						avgrensningerInfoId && (
							<AvgrensningerInfo
								id={avgrensningerInfoId}
								avgrensninger={avgrensninger}
							/>
						)}
					<div className="nav-dagvelger__inputContainer blokk-s">
						<DatoInput
							{...inputProps}
							inputProps={{
								id: id,
								'aria-invalid': invalidDate,
								'aria-describedby': avgrensningerInfoId
							}}
							ref={(c) => (this.input = c)}
							date={this.props.dato}
							onDateChange={this.onDatoDateChange}
						/>
						<KalenderKnapp
							onToggle={this.toggleKalender}
							erÅpen={erÅpen || false}
						/>
					</div>
					{erÅpen && (
						<div ref={(c) => (this.daypickerWrapper = c)} id={`dag`}>
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
						</div>
					)}
				</div>
			</DomEventContainer>
		);
	}
}

export default Dagvelger;
