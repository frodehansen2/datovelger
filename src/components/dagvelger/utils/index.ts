import { DatovelgerAvgrensninger } from '../types';
import * as moment from 'moment';
import { Moment } from 'moment';
import { erDagTilgjengelig } from './datovalidering';

export const normaliserDato = (d: Date): Moment => moment(d).startOf('day');

export const formaterDayAriaLabel = (
	dato: Date,
	locale: string,
	avgrensninger?: DatovelgerAvgrensninger
) => {
	let ariaLabel = moment(dato).format('DD.MM.YYYY (dddd)');
	if (avgrensninger) {
		if (!erDagTilgjengelig(dato)) {
			ariaLabel = ` (ikke tilgjengelig)`;
		}
	}
	return ariaLabel;
};

export const formatDateInputValue = (date?: Date) => {
	return date ? moment(date).format('DD.MM.YYYY') : '';
};
