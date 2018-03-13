import * as React from 'react';
import KalenderIkon from '../../datovelger/KalenderIkon';

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
		className="nav-dagvelger__kalenderknapp"
		onClick={(e) => {
			e.preventDefault();
			onToggle();
		}}
		aria-label={erÅpen ? 'Lukk datovelger' : 'Vis datovelger'}
		aria-pressed={erÅpen}
	>
		<KalenderIkon />
	</button>
);

export default KalenderKnapp;
