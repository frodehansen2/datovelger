import * as React from 'react';
import { SingleDatePicker } from 'react-dates';
import * as moment from 'moment';
import { Moment } from 'moment';

import '../../../node_modules/react-dates/lib/css/_datepicker.css';

export interface Props {}

interface State {
	date: Moment;
	focused: boolean;
}

class Datovelger extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.onDateChange = this.onDateChange.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
		this.state = {
			date: moment(),
			focused: false
		};
	}

	onDateChange(date: moment.Moment) {
		this.setState({ date });
	}

	onFocusChange({ focused }: any) {
		this.setState({
			focused
		});
	}
	render() {
		const { focused, date } = this.state;
		return (
			<div>
				<label htmlFor="date_input">Label for datovelger</label>
				<br />
				<SingleDatePicker
					id="date_input"
					date={date}
					focused={focused}
					onDateChange={this.onDateChange}
					onFocusChange={this.onFocusChange}
					numberOfMonths={1}
					isDayBlocked={(e) => false}
					isOutsideRange={() => false}
					firstDayOfWeek={1}
					hideKeyboardShortcutsPanel={true}
				/>
			</div>
		);
	}
}

export default Datovelger;
