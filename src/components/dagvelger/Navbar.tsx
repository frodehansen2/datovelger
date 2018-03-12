import * as React from 'react';
import Chevron from 'nav-frontend-chevron';

interface NavbarKnapp {
	label: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
}

interface Props {
	forrige: NavbarKnapp;
	neste: NavbarKnapp;
}

const Navbar: React.StatelessComponent<Props> = ({ forrige, neste }) => (
	<div className="nav-dagvelger__navbar">
		<button
			type="button"
			onClick={forrige.onClick}
			disabled={forrige.disabled}
			aria-label={forrige.label}
			className="nav-dagvelger__navbar__knapp nav-dagvelger__navbar__knapp--forrige"
		>
			<Chevron type="venstre" />
		</button>
		<button
			type="button"
			onClick={neste.onClick}
			disabled={neste.disabled}
			aria-label={neste.label}
			className="nav-dagvelger__navbar__knapp nav-dagvelger__navbar__knapp--neste"
		>
			<Chevron type="høyre" />
		</button>
	</div>
);

export default Navbar;
