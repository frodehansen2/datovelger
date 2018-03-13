import * as React from 'react';
import Chevron from 'nav-frontend-chevron';
import * as moment from 'moment';
import { DatovelgerAvgrensninger } from './types';

interface Props {
	måned: Date;
	byttMåned: (month: Date) => void;
	avgrensninger?: DatovelgerAvgrensninger;
}

const Navbar: React.StatelessComponent<Props> = ({
	måned,
	byttMåned,
	avgrensninger
}) => {
	const forrigeMåned = moment(måned).add(-1, 'months');

	const nesteMåned = moment(måned).add(1, 'months');

	const onClick = (evt: React.MouseEvent<HTMLButtonElement>, mnd: Date) => {
		evt.preventDefault();
		evt.stopPropagation();
		byttMåned(mnd);
	};

	const forrigeErDisabled = avgrensninger
		? moment(avgrensninger.minDato).isAfter(forrigeMåned.endOf('month'))
		: false;

	const nesteErDisabled = avgrensninger
		? moment(avgrensninger.maksDato).isBefore(nesteMåned.startOf('month'))
		: false;

	return (
		<div className="nav-dagvelger__navbar">
			<button
				className="nav-dagvelger__navbar__knapp nav-dagvelger__navbar__knapp--forrige"
				type="button"
				onClick={(e) => onClick(e, forrigeMåned.toDate())}
				disabled={forrigeErDisabled}
				aria-label={`Gå til ${forrigeMåned.format('DDDD YYYY')}`}
			>
				<Chevron type="venstre" />
			</button>
			<button
				type="button"
				onClick={(e) => onClick(e, nesteMåned.toDate())}
				disabled={nesteErDisabled}
				aria-label={`Gå til ${nesteMåned.format('DDDD YYYY')}`}
				className="nav-dagvelger__navbar__knapp nav-dagvelger__navbar__knapp--neste"
			>
				<Chevron type="høyre" />
			</button>
		</div>
	);
};

export default Navbar;
