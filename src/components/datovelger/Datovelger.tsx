import * as React from 'react';
import { SingleDatePicker, SingleDatePickerShape } from 'react-dates';
import * as moment from 'moment';
import { Moment } from 'moment';
import Chevron from 'nav-frontend-chevron';

import '../../../node_modules/react-dates/lib/css/_datepicker.css';

import { DatovelgerAvgrensninger } from './types';
import {
	erDatoTilgjengelig,
	normaliserDato,
	erDatoInnenforTidsperiode
} from './utils';

import fraserBokmal from './phrases_nb_NO';

import './datovelger.less';

export interface Props {
	/** identifikator */
	id: string;
	/** Valgt dato */
	dato: Date | null;
	/** Avgrensninger på hvilke datoer som er gyldig og ikke */
	avgrensninger?: DatovelgerAvgrensninger;
	/** Funksjon som kalles når gyldig dato velges */
	onChange: (date: Date | null, inputValue?: string) => void;
	/** Om tastaturinfo skal vises. Default true */
	skjulTastaturinfo?: boolean;
	/** react-dates props */
	reactDatesProps?: SingleDatePickerShape | any;
}

const TRANSITION_DURATION = 50;
const BLUR_DELAY = TRANSITION_DURATION + 100;

interface State {
	focused: boolean;
	dato: Moment | null;
}

const defaultProps: SingleDatePickerShape = {
	date: moment(),
	id: 'none',
	onDateChange: () => null,
	onFocusChange: () => null,
	focused: false,
	numberOfMonths: 1,
	firstDayOfWeek: 1,
	hideKeyboardShortcutsPanel: false,
	noBorder: true
};

const mapProps = (props: Props) => {
	const { avgrensninger } = props;

	if (avgrensninger) {
		const minDato =
			avgrensninger.minDato && normaliserDato(avgrensninger.minDato);
		const maksDato =
			avgrensninger.maksDato && normaliserDato(avgrensninger.maksDato);

		return {
			enableOutsideDays:
				(props.dato &&
					minDato &&
					minDato.isBefore(normaliserDato(props.dato))) ||
				false,
			isOutsideRange: (d: Moment) =>
				erDatoInnenforTidsperiode(d, minDato, maksDato),
			isDayBlocked: (d: Moment) => erDatoTilgjengelig(d, avgrensninger)
		};
	}
	return {};
};

class Datovelger extends React.Component<Props, State> {
	divContainer: HTMLDivElement | null;
	blurTimerId: any;

	constructor(props: Props) {
		super(props);
		this.onDateChange = this.onDateChange.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
		this.getInputValue = this.getInputValue.bind(this);
		this.getDato = this.getDato.bind(this);
		this.onClose = this.onClose.bind(this);
		this.onComponentBlur = this.onComponentBlur.bind(this);
		this.getInputField = this.getInputField.bind(this);
		this.onNextMonthClick = this.onNextMonthClick.bind(this);
		this.onPrevMonthClick = this.onPrevMonthClick.bind(this);
		this.keepFocusOnButtonAfterMonthClick = this.keepFocusOnButtonAfterMonthClick.bind(
			this
		);
		this.resetBlurTimer = this.resetBlurTimer.bind(this);
		this.state = {
			focused: false,
			dato: props.dato ? moment(normaliserDato(props.dato)) : null
		};
	}

	componentWillReceiveProps(nextProps: Props) {
		if (!nextProps.dato) {
			this.setState({
				dato: null
			});
		} else if (moment.isMoment(moment(nextProps.dato))) {
			this.setState({
				dato: moment(normaliserDato(nextProps.dato))
			});
		}
	}

	getDato(): Date | null {
		if (
			this.state.dato === null ||
			this.state.dato === undefined ||
			!moment.isMoment(this.state.dato)
		) {
			return null;
		}
		return moment(this.state.dato).toDate();
	}

	getInputValue() {
		const el = this.getInputField();
		if (el && el.value) {
			return el.value;
		}
		return undefined;
	}

	getInputField() {
		return document.getElementById(this.props.id) as HTMLInputElement;
	}

	triggerOnChange() {
		setTimeout(() => {
			const { dato } = this.state;
			if (dato) {
				this.props.onChange(dato.toDate(), this.getInputValue());
			} else {
				if (document.activeElement !== this.getInputField()) {
					this.props.onChange(null, this.getInputValue());
				}
			}
		}, 0);
	}

	onDateChange(date: Moment | null) {
		this.setState({ dato: date });
		this.triggerOnChange();
	}

	onFocusChange({ focused }: any) {
		this.setState({
			focused
		});
	}

	onClose() {
		this.triggerOnChange();
	}

	onNextMonthClick(newCurrentMonth: Moment) {
		this.resetBlurTimer();
		if (this.blurTimerId) {
			clearTimeout(this.blurTimerId);
			this.blurTimerId = undefined;
		}
		setTimeout(() => this.keepFocusOnButtonAfterMonthClick('next'), 0);
	}

	onPrevMonthClick(newCurrentMonth: Moment) {
		this.resetBlurTimer();
		if (this.blurTimerId) {
			clearTimeout(this.blurTimerId);
			this.blurTimerId = undefined;
		}
		setTimeout(() => this.keepFocusOnButtonAfterMonthClick('prev'), 0);
	}

	keepFocusOnButtonAfterMonthClick(button: 'next' | 'prev') {
		if (
			this.divContainer &&
			!this.divContainer.contains(document.activeElement)
		) {
			const bt = this.divContainer.querySelector(
				`.DayPickerNavigation_button:nth-child(${button === 'next' ? 2 : 1})`
			) as HTMLButtonElement;
			if (bt) {
				bt.focus();
			}
		}
	}

	resetBlurTimer() {
		if (this.blurTimerId) {
			clearTimeout(this.blurTimerId);
			this.blurTimerId = undefined;
		}
	}

	onComponentBlur(e: React.FocusEvent<HTMLDivElement>) {
		this.resetBlurTimer();
		const el = this.divContainer;
		if (el) {
			if (this.blurTimerId) {
				clearTimeout(this.blurTimerId);
			}
			this.blurTimerId = setTimeout(() => {
				const activeElement = document.activeElement;
				if (!el.contains(activeElement)) {
					this.setState({ focused: false });
					this.triggerOnChange();
				}
			}, BLUR_DELAY);
		}
	}

	render() {
		const mappedProps: SingleDatePickerShape = {
			id: this.props.id,
			date: this.state.dato,
			focused: this.state.focused,
			onDateChange: this.onDateChange,
			onFocusChange: this.onFocusChange,
			onClose: this.onClose,
			keepOpenOnDateSelect: false,
			placeholder: 'dd.mm.åååå',
			transitionDuration: TRANSITION_DURATION,
			navNext: <Chevron type="høyre" />,
			navPrev: <Chevron type="venstre" />,
			phrases: fraserBokmal as any,
			hideKeyboardShortcutsPanel: this.props.skjulTastaturinfo,
			...mapProps(this.props)
		};

		return (
			<div
				className="nav-datovelger"
				onBlur={this.onComponentBlur}
				ref={(c) => (this.divContainer = c)}
			>
				<SingleDatePicker
					{...defaultProps}
					{...mappedProps}
					{...this.props.reactDatesProps}
					onNextMonthClick={this.onNextMonthClick}
					onPrevMonthClick={this.onPrevMonthClick}
				/>
			</div>
		);
	}
}

export default Datovelger;
