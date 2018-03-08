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
	onChange: (date: Date, inputValue?: string) => void;
	/** Om tastaturinfo skal vises. Default true */
	skjulTastaturinfo?: boolean;
	/** react-dates props */
	reactDatesProps?: SingleDatePickerShape | any;
}

const TRANSITION_DURATION = 50;

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
	hideKeyboardShortcutsPanel: false
};

const mapProps = (props: Props) => {
	const { avgrensninger } = props;

	if (avgrensninger) {
		// const dato = ;
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

	constructor(props: Props) {
		super(props);
		this.onDateChange = this.onDateChange.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
		this.getInputValue = this.getInputValue.bind(this);
		this.getDato = this.getDato.bind(this);
		this.onComponentBlur = this.onComponentBlur.bind(this);
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
		const el = document.getElementById(this.props.id) as HTMLInputElement;
		if (el && el.value) {
			return el.value;
		}
		return undefined;
	}

	onDateChange(date: Moment | null) {
		this.setState({ dato: date });
		if (moment.isMoment(date)) {
			this.props.onChange(date.toDate(), this.getInputValue());
		}
	}

	onFocusChange({ focused }: any) {
		this.setState({
			focused
		});
	}

	onComponentBlur(e: React.FocusEvent<HTMLDivElement>) {
		const el = this.divContainer;
		if (el) {
			setTimeout(() => {
				if (!el.contains(document.activeElement)) {
					this.setState({ focused: false });
				}
			}, TRANSITION_DURATION + 5);
		}
	}

	render() {
		const mappedProps: SingleDatePickerShape = {
			id: this.props.id,
			date: this.state.dato,
			focused: this.state.focused,
			onDateChange: this.onDateChange,
			onFocusChange: this.onFocusChange,
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
				/>
			</div>
		);
	}
}

export default Datovelger;
