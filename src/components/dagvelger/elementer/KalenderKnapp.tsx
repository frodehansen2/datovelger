import * as React from 'react';
import KalenderIkon from '../../datovelger/KalenderIkon';

export interface Props {
	onToggle: () => void;
}

const KalenderKnapp: React.StatelessComponent<Props> = ({ onToggle }) => (
	<button
		type="button"
		className="nav-dagvelger__kalenderknapp"
		onClick={(e) => {
			e.preventDefault();
			onToggle();
		}}
	>
		<KalenderIkon />
	</button>
);

export default KalenderKnapp;
