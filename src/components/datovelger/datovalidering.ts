import * as moment from 'moment';
import { normaliserDato } from './utils';
import { DatovelgerAvgrensninger, DatovelgerTidsperiode } from './types';

type DatoValideringsfeil =
	| 'udefinert'
	| 'ugyldigDato'
	| 'datoErFørMinDato'
	| 'datoErEtterMaksDato'
	| 'datoErIkkeUkedag'
	| 'datoErIUgyldigPeriode';

export const validerDato = (
	dato: Date | string | null | undefined,
	avgrensninger: DatovelgerAvgrensninger
): DatoValideringsfeil | undefined => {
	if (dato === 'string' && dato.length < 8) {
		dato = undefined;
	}
	if (!dato) {
		return 'udefinert';
	}
	if (typeof dato === 'string') {
		dato = moment(dato).toDate();
	}
	if (!moment(dato).isValid()) {
		return 'ugyldigDato';
	}
	if (!datoErEtterMinDato(dato, avgrensninger.minDato)) {
		return 'datoErFørMinDato';
	}
	if (!datoErFørSluttdato(dato, avgrensninger.maksDato)) {
		return 'datoErEtterMaksDato';
	}
	if (!datoErUkedag(dato)) {
		return 'datoErIkkeUkedag';
	}
	if (erDatoITidsperioder(dato, avgrensninger.ugyldigeTidsperioder)) {
		return 'datoErIUgyldigPeriode';
	}

	return;
};

export const datoErDefinert = (dato: Date) =>
	dato !== undefined && dato !== null;

export const datoErDato = (dato: Date) => moment.isDate(dato);

export const datoErEtterMinDato = (dato: Date, minDato?: Date) => {
	return (
		!minDato || normaliserDato(dato).isSameOrAfter(normaliserDato(minDato))
	);
};

export const datoErFørSluttdato = (dato: Date, maksDato?: Date) => {
	return (
		!maksDato || normaliserDato(dato).isSameOrBefore(normaliserDato(maksDato))
	);
};

export const datoErUkedag = (dato: Date) => {
	const dag = normaliserDato(dato).isoWeekday();
	return dag <= 5;
};

export const erDatoITidsperioder = (
	dato: Date,
	tidsperioder?: DatovelgerTidsperiode[]
) => {
	if (!tidsperioder || tidsperioder.length === 0) {
		return false;
	}
	const d = normaliserDato(dato);
	let gyldig: boolean = false;
	tidsperioder.forEach((periode) => {
		if (
			gyldig &&
			d.isSameOrAfter(normaliserDato(periode.startdato)) &&
			d.isSameOrBefore(normaliserDato(periode.sluttdato))
		) {
			gyldig = true;
		}
	});
	return gyldig;
};
