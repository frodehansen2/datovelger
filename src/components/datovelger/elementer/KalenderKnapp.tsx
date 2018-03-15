import * as React from 'react';
import KalenderIkon from './KalenderIkon';

export interface Props {
	onToggle: () => void;
	erÅpen: boolean;
}

const KalenderKnapp: React.StatelessComponent<Props> = ({
	onToggle,
	erÅpen
}) => (
	<button
		type="button"
		className="nav-datovelger__kalenderknapp"
		onClick={(e) => {
			e.preventDefault();
			onToggle();
		}}
		role="button"
		aria-label={erÅpen ? 'Kalender' : 'Kalender'}
		aria-expanded={erÅpen}
	>
		<KalenderIkon />
	</button>
);

export default KalenderKnapp;
