import * as React from 'react';
// import Chevron from 'nav-frontend-chevron';
import * as classnames from 'classnames';
import { DatovelgerAvgrensninger } from './types';
import { normaliserDato } from './utils';

/** Denner foreløpig ikke registert riktig i forhold til typings */
const localeUtils = require('react-day-picker/moment');

import DayPicker, {
	DayPickerProps,
	Modifier,
	RangeModifier,
	AfterModifier,
	BeforeModifier,
	DaysOfWeekModifier
} from 'react-day-picker';
import '../../../node_modules/react-day-picker/lib/style.css';
import KalenderIkon from './KalenderIkon';

export interface Props {
	/** identifikator */
	id: string;
	/** Valgt dato */
	dato: Date | null;
	/** Avgrensninger på hvilke datoer som er gyldig og ikke */
	avgrensninger?: DatovelgerAvgrensninger;
	/** Funksjon som kalles når gyldig dato velges */
	onChange: (date: Date | null, inputValue?: string) => void;
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

class Dagvelger extends React.Component<Props> {
	divContainer: HTMLDivElement | null;
	input: HTMLInputElement | null;

	constructor(props: Props) {
		super(props);
		this.onDayClick = this.onDayClick.bind(this);
	}

	onDayClick(date: Date) {
		this.props.onChange(date);
	}

	render() {
		const { dato, locale = 'no', visUkenumre = false } = this.props;
		return (
			<div
				className={classnames('nav-dagvelger')}
				ref={(c) => (this.divContainer = c)}
			>
				<div className="nav-dagvelger__inputContainer blokk-s">
					<button
						type="button"
						className="nav-dagvelger__kalenderikon"
						role="presentation"
						aria-hidden="true"
						tabIndex={-1}
					>
						<KalenderIkon />
					</button>

					<input
						className="nav-dagvelger__input"
						type="text"
						ref={(c) => (this.input = c)}
					/>
				</div>
				<DayPicker
					locale={locale}
					localeUtils={localeUtils}
					canChangeMonth={false}
					selectedDays={dato || new Date()}
					onDayClick={this.onDayClick}
					firstDayOfWeek={1}
					showWeekNumbers={visUkenumre}
					showWeekDays={true}
					showOutsideDays={false}
					onWeekClick={undefined}
					modifiers={{
						termin: new Date(2018, 2, 23)
					}}
					{...mapProps(this.props)}
				/>
			</div>
		);
	}
}

export default Dagvelger;
