import * as React from 'react';
// import Chevron from 'nav-frontend-chevron';
import * as classnames from 'classnames';
import * as moment from 'moment';
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
import Navbar from './Navbar';

interface State {
	month?: Date | undefined;
}

export interface Props {
	/** identifikator */
	id: string;
	/** Valgt dato */
	dato?: Date | null;
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

class Dagvelger extends React.Component<Props, State> {
	divContainer: HTMLDivElement | null;
	input: HTMLInputElement | null;

	constructor(props: Props) {
		super(props);
		this.onDayClick = this.onDayClick.bind(this);
		this.onForrigeMånedClick = this.onForrigeMånedClick.bind(this);
		this.onNesteMånedClick = this.onNesteMånedClick.bind(this);
		this.state = {
			month: props.dato || new Date()
		};
	}

	onDayClick(date: Date) {
		this.props.onChange(date);
	}

	onForrigeMånedClick(evt: React.MouseEvent<HTMLButtonElement>) {
		evt.preventDefault();
		evt.stopPropagation();
		const mnd = moment(this.state.month)
			.add(-1, 'months')
			.toDate();
		this.setState({
			month: mnd
		});
	}

	onNesteMånedClick(evt: React.MouseEvent<HTMLButtonElement>) {
		evt.preventDefault();
		evt.stopPropagation();
		const mnd = moment(this.state.month)
			.add(1, 'months')
			.toDate();
		this.setState({
			month: mnd
		});
	}

	render() {
		const {
			dato,
			locale = 'no',
			visUkenumre = false,
			avgrensninger
		} = this.props;

		const kanGåTilForrigeMåned =
			avgrensninger &&
			avgrensninger.minDato &&
			moment(this.state.month).isAfter(avgrensninger.minDato);
		const kanGåTilNesteMåned =
			avgrensninger &&
			avgrensninger.maksDato &&
			moment(this.state.month).isBefore(avgrensninger.maksDato);

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
					navbarElement={
						<Navbar
							forrige={{
								label: 'Gå til forrige måned',
								disabled: !kanGåTilForrigeMåned,
								onClick: this.onForrigeMånedClick
							}}
							neste={{
								label: 'Gå til forrige måned',
								disabled: !kanGåTilNesteMåned,
								onClick: this.onNesteMånedClick
							}}
						/>
					}
					month={this.state.month}
					selectedDays={dato || new Date()}
					onDayClick={this.onDayClick}
					firstDayOfWeek={1}
					showWeekNumbers={visUkenumre}
					showWeekDays={true}
					showOutsideDays={false}
					onWeekClick={undefined}
					{...mapProps(this.props)}
				/>
			</div>
		);
	}
}

export default Dagvelger;
