import * as React from 'react';
import { SingleDatePicker, SingleDatePickerShape } from 'react-dates';
import * as moment from 'moment';
import { Moment } from 'moment';

import '../../../node_modules/react-dates/lib/css/_datepicker.css';
import { DatovelgerAvgrensninger } from './types';
import {
	erDatoTilgjengelig,
	normaliserDato,
	erDatoInnenforTidsperiode
} from './utils';

export interface Props {
	/** identifikator */
	id: string;
	/** Valgt dato */
	dato?: Date;
	/** Avgrensninger på hvilke datoer som er gyldig og ikke */
	avgrensninger?: DatovelgerAvgrensninger;
	/** Funksjon som kalles når gyldig dato velges */
	onChange: (date: Date) => void;
	/** react-dates props */
	reactDatesProps?: SingleDatePickerShape | any;
}

interface State {
	focused: boolean;
}

const defaultProps: SingleDatePickerShape = {
	date: moment(),
	id: 'none',
	onDateChange: () => null,
	onFocusChange: () => null,
	focused: false,
	numberOfMonths: 1,
	firstDayOfWeek: 1,
	hideKeyboardShortcutsPanel: true
};

const mapProps = (props: Props) => {
	const { avgrensninger } = props;

	if (avgrensninger && props.dato) {
		const dato = normaliserDato(props.dato);
		const minDato =
			avgrensninger.minDato && normaliserDato(avgrensninger.minDato);
		const maksDato =
			avgrensninger.maksDato && normaliserDato(avgrensninger.maksDato);

		return {
			enableOutsideDays: minDato && minDato.isBefore(dato),
			isOutsideRange: (d: Moment) =>
				erDatoInnenforTidsperiode(d, minDato, maksDato),
			isDayBlocked: (d: Moment) => erDatoTilgjengelig(d, avgrensninger)
		};
	}
	return {};
};

class Datovelger extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.onDateChange = this.onDateChange.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
		this.state = {
			focused: true
		};
	}

	onDateChange(date: moment.Moment) {
		this.props.onChange(date.toDate());
	}

	onFocusChange({ focused }: any) {
		this.setState({
			focused
		});
	}

	render() {
		const dato = normaliserDato(this.props.dato || moment().toDate());

		const mappedProps: SingleDatePickerShape = {
			id: this.props.id,
			date: dato,
			focused: this.state.focused,
			onDateChange: this.onDateChange,
			onFocusChange: this.onFocusChange,
			...mapProps(this.props)
		};

		return (
			<div>
				<label htmlFor="date_input">Label for datovelger</label>
				<br />
				<SingleDatePicker
					date={this.props.dato}
					firstDayOfWeek={1}
					{...defaultProps}
					{...mappedProps}
					{...this.props.reactDatesProps}
				/>
			</div>
		);
	}
}

export default Datovelger;
