import * as React from 'react';
import * as moment from 'moment';
import * as classnames from 'classnames';
import Chevron from 'nav-frontend-chevron';
import { DatovelgerAvgrensninger } from './types';

interface Props {
	måned: Date;
	byttMåned: (month: Date) => void;
	byttÅr?: (month: Date) => void;
	avgrensninger?: DatovelgerAvgrensninger;
}

interface NavbarKnappProps {
	måned: Date;
	retning: 'forrige' | 'neste';
	disabled: boolean;
	onClick: (evt: React.MouseEvent<HTMLButtonElement>, måned: Date) => void;
}

const formatMåned = (måned: Date) => moment(måned).format('MMMM');

const NavbarKnapp: React.StatelessComponent<NavbarKnappProps> = ({
	måned,
	retning,
	disabled,
	onClick
}) => {
	const label = `Bytt til ${formatMåned(måned)}`;

	return (
		<button
			className={classnames(
				'nav-dagvelger__navbar__knapp',
				`nav-dagvelger__navbar__knapp--${retning}`,
				{
					'nav-dagvelger__navbar__knapp--disabled': disabled
				}
			)}
			type="button"
			onClick={(e) => (disabled ? null : onClick(e, måned))}
			aria-label={label}
			aria-disabled={disabled}
		>
			<Chevron type={retning === 'forrige' ? 'venstre' : 'høyre'} />
		</button>
	);
};

const Navbar: React.StatelessComponent<Props> = ({
	måned,
	byttMåned,
	avgrensninger
}) => {
	const forrigeMåned = moment(måned).add(-1, 'months');
	const nesteMåned = moment(måned).add(1, 'months');

	const forrigeErDisabled = avgrensninger
		? moment(avgrensninger.minDato).isAfter(forrigeMåned.endOf('month'))
		: false;

	const nesteErDisabled = avgrensninger
		? moment(avgrensninger.maksDato).isBefore(nesteMåned.startOf('month'))
		: false;

	const onClick = (evt: React.MouseEvent<HTMLButtonElement>, mnd: Date) => {
		evt.preventDefault();
		evt.stopPropagation();
		byttMåned(mnd);
	};

	return (
		<div
			className="nav-dagvelger__navbar"
			role="presentation"
			aria-hidden="true"
		>
			<NavbarKnapp
				måned={forrigeMåned.toDate()}
				retning="forrige"
				disabled={forrigeErDisabled}
				onClick={onClick}
			/>
			<NavbarKnapp
				måned={nesteMåned.toDate()}
				retning="neste"
				disabled={nesteErDisabled}
				onClick={onClick}
			/>
		</div>
	);
};

export default Navbar;
