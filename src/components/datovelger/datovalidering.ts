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
	dato: Date,
	avgrensninger: DatovelgerAvgrensninger
): DatoValideringsfeil | undefined => {
	if (!dato) {
		return 'udefinert';
	}
	if (!moment.isDate(dato)) {
		return 'ugyldigDato';
	}
	if (!datoErEtterMinDato(dato, avgrensninger.minDato)) {
		return 'datoErFørMinDato';
	}
	if (datoErFørSluttdato(dato, avgrensninger.maksDato)) {
		return 'datoErEtterMaksDato';
	}
	if (!datoErUkedag(dato)) {
		return 'datoErIkkeUkedag';
	}
	if (datoErIkkeIUgyldigePeriode(dato, avgrensninger.ugyldigeTidsperioder)) {
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
	return dag === 6 || dag === 7;
};

export const datoErIkkeIUgyldigePeriode = (
	dato: Date,
	ugyldigeTidsperioder?: DatovelgerTidsperiode[]
) => {
	if (!ugyldigeTidsperioder || ugyldigeTidsperioder.length === 0) {
		return true;
	}
	const d = normaliserDato(dato);
	let gyldig: boolean = true;
	ugyldigeTidsperioder.forEach((periode) => {
		if (
			gyldig &&
			d.isSameOrAfter(normaliserDato(periode.startdato)) &&
			d.isSameOrBefore(normaliserDato(periode.sluttdato))
		) {
			gyldig = false;
		}
	});
	return gyldig;
};
