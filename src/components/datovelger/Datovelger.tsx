import * as React from 'react';
import * as classnames from 'classnames';
import { guid } from 'nav-frontend-js-utils';
import { DatovelgerAvgrensninger } from './types';
import { formatDateInputValue, normaliserDato } from './utils';

import '../../../node_modules/react-day-picker/lib/style.css';
import { validerDato, DatoValidering } from './utils/datovalidering';
import KalenderKnapp from './elementer/KalenderKnapp';
import DomEventContainer from '../DomEventContainer';
import Datoinput from './Datoinput';
import AvgrensningerInfo from './elementer/AvgrensningerInfo';
import Kalender from './kalender/Kalender';
import {
	Modifier,
	RangeModifier,
	DaysOfWeekModifier,
	BeforeModifier,
	AfterModifier
} from 'react-day-picker';

interface State {
	måned: Date;
	datovalidering: DatoValidering;
	erÅpen?: boolean;
	statusMessage: string;
}

export interface Props {
	/** Påkrevd id til inputfelt */
	id: string;
	/** Valgt dato */
	dato?: Date;
	/** Begrensninger på hvilke datoer bruker kan velge */
	avgrensninger?: DatovelgerAvgrensninger;
	/** Kalles når en dato velges */
	velgDag: (date: Date) => void;
	/** Input props */
	inputProps?: {
		placeholder?: string;
		required?: boolean;
		ariaDescribedby?: string;
	};
	/** Kalles når en ikke lovlig dato velges */
	ugyldigDagValgt?: (date: Date, validering?: DatoValidering) => void;
	/** Språk - default no */
	locale?: 'nb';
	/** Om ukenumre skal vises - default false */
	visUkenumre?: boolean;
}

const getUtilgjengeligeDager = (
	avgrensninger: DatovelgerAvgrensninger
): Modifier[] => {
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
	return [
		...ugyldigeDager,
		...(maksDato ? [{ after: maksDato.toDate() } as AfterModifier] : []),
		...(minDato ? [{ before: minDato.toDate() } as BeforeModifier] : []),
		...[helgedager as DaysOfWeekModifier]
	];
};
class Datovelger extends React.Component<Props, State> {
	id: string;
	input: Datoinput | null;
	setFokusPåKalenderKnapp: boolean | undefined;
	kalender: Kalender | null;
	kalenderKnapp: KalenderKnapp | null;

	constructor(props: Props) {
		super(props);

		this.id = guid();

		this.onVelgDag = this.onVelgDag.bind(this);
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

	onVelgDag(dato: Date, lukkKalender?: boolean) {
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
		if (lukkKalender) {
			this.lukkKalender(true);
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

	toggleKalender() {
		this.setFokusPåKalenderKnapp = true;
		this.setState({ erÅpen: !this.state.erÅpen });
	}

	lukkKalender(settFokusPåKalenderknapp?: boolean) {
		this.setState({ erÅpen: false });
		this.setFokusPåKalenderKnapp = settFokusPåKalenderknapp;
	}

	componentDidUpdate(prevProps: Props, prevState: State) {
		if (!prevState.erÅpen && this.state.erÅpen && this.kalender) {
			this.kalender.settFokus();
		} else if (
			prevState.erÅpen &&
			!this.state.erÅpen &&
			this.setFokusPåKalenderKnapp &&
			this.kalenderKnapp
		) {
			this.setFokusPåKalenderKnapp = false;
			this.kalenderKnapp.focus();
		}
	}

	render() {
		const {
			dato,
			id,
			inputProps,
			avgrensninger,
			locale = 'nb',
			...kalenderProps
		} = this.props;

		const { erÅpen, datovalidering } = this.state;
		const avgrensningerInfoId = avgrensninger ? `${this.id}_srDesc` : undefined;
		const invalidDate =
			datovalidering !== 'gyldig' && this.props.dato !== undefined;

		return (
			<DomEventContainer>
				<div className={classnames('nav-datovelger')}>
					{avgrensninger &&
						avgrensningerInfoId && (
							<AvgrensningerInfo
								id={avgrensningerInfoId}
								avgrensninger={avgrensninger}
							/>
						)}
					<div className="nav-datovelger__inputContainer blokk-s">
						<Datoinput
							{...inputProps}
							inputProps={{
								id: id,
								'aria-invalid': invalidDate,
								'aria-describedby': avgrensningerInfoId
							}}
							ref={(c) => (this.input = c)}
							date={dato}
							onDateChange={this.onDatoDateChange}
						/>
						<KalenderKnapp
							ref={(c) => (this.kalenderKnapp = c)}
							onClick={this.toggleKalender}
							erÅpen={erÅpen || false}
						/>
					</div>
					{erÅpen && (
						<Kalender
							ref={(c) => (this.kalender = c)}
							{...kalenderProps}
							locale={locale}
							dato={dato}
							måned={dato || new Date()}
							min={avgrensninger && avgrensninger.minDato}
							maks={avgrensninger && avgrensninger.maksDato}
							utilgjengeligeDager={
								avgrensninger
									? getUtilgjengeligeDager(avgrensninger)
									: undefined
							}
							onVelgDag={(d) => this.onVelgDag(d, true)}
							onLukk={() => this.lukkKalender(true)}
						/>
					)}
				</div>
			</DomEventContainer>
		);
	}
}

export default Datovelger;
