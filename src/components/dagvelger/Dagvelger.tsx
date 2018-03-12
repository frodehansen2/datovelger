import * as React from 'react';
// import Chevron from 'nav-frontend-chevron';
import * as classnames from 'classnames';

import { DatovelgerAvgrensninger } from './types';
import { normaliserDato } from './utils';

import DayPicker, {
	DayPickerProps,
	Modifier,
	RangeModifier,
	AfterModifier,
	BeforeModifier,
	DaysOfWeekModifier
} from 'react-day-picker';
import '../../../node_modules/react-day-picker/lib/style.css';

// import './styles/datovelger.less';
import KalenderIkon from './KalenderIkon';
import * as moment from 'moment';
import { Moment } from 'moment';

export interface Props {
	/** identifikator */
	id: string;
	/** Valgt dato */
	dato: Date | null;
	/** Avgrensninger på hvilke datoer som er gyldig og ikke */
	avgrensninger?: DatovelgerAvgrensninger;
	/** Funksjon som kalles når gyldig dato velges */
	onChange: (date: Date | null, inputValue?: string) => void;
	/** Default true */
	visKalenderikon?: boolean;
}

interface State {
	dato: Moment | null;
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
	divContainer: HTMLDivElement | null;
	input: HTMLInputElement | null;

	constructor(props: Props) {
		super(props);
		this.onDayClick = this.onDayClick.bind(this);
		this.state = {
			dato: props.dato ? moment(normaliserDato(props.dato)) : null
		};
	}

	onDayClick(date: Date) {
		this.props.onChange(date);
	}

	onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			// e.preventDefault(); // Ikke scroll siden
		}
	}

	render() {
		const { visKalenderikon = true } = this.props;
		return (
			<div
				className={classnames('nav-dagvelger', {
					'nav-dagvelger--medKalenderikon': visKalenderikon
				})}
				ref={(c) => (this.divContainer = c)}
			>
				<div className="nav-dagvelger__inputContainer blokk-s">
					{visKalenderikon && (
						<button
							type="button"
							className="nav-dagvelger__kalenderikon"
							role="presentation"
							aria-hidden="true"
							tabIndex={-1}
						>
							<KalenderIkon />
						</button>
					)}
					<input
						className="nav-dagvelger__input"
						type="text"
						ref={(c) => (this.input = c)}
					/>
				</div>
				<DayPicker
					locale="no"
					selectedDays={this.props.dato || new Date()}
					onDayClick={this.onDayClick}
					firstDayOfWeek={1}
					showWeekNumbers={true}
					showWeekDays={true}
					onKeyDown={this.onKeyDown}
					showOutsideDays={false}
					{...mapProps(this.props)}
				/>
			</div>
		);
	}
}

export default Dagvelger;
