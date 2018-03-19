import * as React from 'react';
import DayPicker, { DayPickerProps, Modifier } from 'react-day-picker';
import * as moment from 'moment';
import * as FocusTrap from 'focus-trap-react';
import {
	dagDatoNøkkel,
	fokuserPåDato,
	getFokusertDato,
	getSammeDatoIMåned,
	erMånedTilgjengelig,
	fokuserKalender,
	formaterDayAriaLabel
} from '../utils';
import Navbar from './Navbar';
import KeyboardNavigation from '../../common/KeyboardNavigation';
import { TittelOgNavigasjon } from './TittelOgNavigasjon';

import 'moment/locale/nb';
const momentLocaleUtils = require('react-day-picker/moment');

export interface Props {
	måned: Date;
	dato?: Date;
	locale?: string;
	min?: Date;
	maks?: Date;
	onVelgDag: (dato: Date) => void;
	onLukk: () => void;
	utilgjengeligeDager?: Modifier[];
	visUkenumre?: boolean;
}

interface State {
	måned: Date;
}

export class Kalender extends React.Component<Props, State> {
	kalender: HTMLDivElement | null;
	nesteFokusertDato: Date | undefined;
	setFokusPåInput: boolean | undefined;

	constructor(props: Props) {
		super(props);
		this.navigerMåneder = this.navigerMåneder.bind(this);
		this.settFokus = this.settFokus.bind(this);
		this.onByttMåned = this.onByttMåned.bind(this);
		this.state = {
			måned: props.måned
		};
	}

	componentDidUpdate(prevProps: Props, prevState: State) {
		if (
			prevState.måned !== this.state.måned &&
			this.kalender &&
			this.nesteFokusertDato
		) {
			fokuserPåDato(this.kalender, this.nesteFokusertDato);
			this.nesteFokusertDato = undefined;
		}
	}

	settFokus() {
		if (this.kalender) {
			fokuserKalender(this.kalender);
		}
	}

	onByttMåned(måned: Date) {
		const fokusertDato = getFokusertDato(this.kalender);
		this.nesteFokusertDato = fokusertDato
			? getSammeDatoIMåned(fokusertDato, this.state.måned, måned)
			: undefined;
		this.setState({
			måned
		});
	}

	navigerMåneder(evt: React.KeyboardEvent<any>, antall: number) {
		evt.preventDefault();
		const mnd = moment(this.state.måned)
			.add(antall, 'month')
			.toDate();
		if (
			erMånedTilgjengelig(mnd, { min: this.props.min, maks: this.props.maks })
		) {
			this.onByttMåned(mnd);
		}
	}

	render() {
		const {
			dato,
			min,
			maks,
			locale = 'nb',
			onVelgDag,
			onLukk,
			visUkenumre,
			utilgjengeligeDager
		} = this.props;
		const { måned } = this.state;

		const localeUtils = {
			...momentLocaleUtils,
			formatDay: (d: Date, l: string) => formaterDayAriaLabel(d, l),
			formatMonthTitle: (d: Date) => moment(d).format('MMMM YYYY'),
			formatWeekdayLong: (day: number) => moment.weekdays(day),
			formatWeekdayShort: (day: number) => moment.weekdaysShort(day)
		};

		const innstillinger: DayPickerProps = {
			locale,
			localeUtils,
			navbarElement: <span />,
			captionElement: (
				<TittelOgNavigasjon
					date={måned}
					locale={locale}
					localeUtils={localeUtils}
					navbar={
						<Navbar
							måned={måned}
							byttMåned={(d: Date) => this.onByttMåned(d)}
							min={min}
							maks={maks}
						/>
					}
				/>
			),
			firstDayOfWeek: 1,
			showWeekNumbers: visUkenumre
		};

		return (
			<div ref={(c) => (this.kalender = c)} role="dialog" aria-label="Kalender">
				<KeyboardNavigation onEscape={onLukk}>
					<FocusTrap
						active={true}
						focusTrapOptions={{ clickOutsideDeactivates: true }}
					>
						<DayPicker
							locale={locale}
							localeUtils={localeUtils}
							renderDay={(d) => (
								<span data-date={dagDatoNøkkel(d)} aria-hidden="true">
									{d.getDate()}
								</span>
							)}
							fromMonth={min}
							toMonth={maks}
							month={måned}
							canChangeMonth={false}
							selectedDays={dato}
							onDayClick={onVelgDag}
							onMonthChange={this.onByttMåned}
							disabledDays={utilgjengeligeDager}
							{...innstillinger}
						/>
					</FocusTrap>
				</KeyboardNavigation>
			</div>
		);
	}
}
export default Kalender;
