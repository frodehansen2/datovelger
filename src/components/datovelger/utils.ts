import { DatovelgerTidsperiode, DatovelgerAvgrensninger } from './types';
import * as moment from 'moment';
import { Moment } from 'moment';

export const normaliserDato = (d: Date): Moment => moment(d).startOf('day');

export const erDatoGyldig = (
	dato: Date,
	options: {
		helgerTillatt: boolean;
		ugyldigePerioder: DatovelgerTidsperiode[];
		minDato: Date;
		maksDato: Date;
	}
): boolean => {
	return true;
};

export const erDatoTilgjengelig = (
	d: Moment,
	avgensninger: DatovelgerAvgrensninger
): boolean => {
	d = normaliserDato(d.toDate()) as Moment;
	let blocked = false;

	if (avgensninger.helgedagerIkkeTillatt) {
		blocked = d.isoWeekday() === 6 || d.isoWeekday() === 7;
	}

	if (!blocked && avgensninger.ugyldigeTidsperioder) {
		avgensninger.ugyldigeTidsperioder.forEach((p) => {
			if (
				!blocked &&
				(d.isSameOrAfter(normaliserDato(p.startdato)) &&
					d.isSameOrBefore(normaliserDato(p.sluttdato)))
			) {
				blocked = true;
			}
		});
	}

	return blocked;
};

export const erDatoInnenforTidsperiode = (
	d: Moment,
	minDato?: Moment,
	maksDato?: Moment
) => {
	return (
		(minDato && d.isBefore(minDato)) ||
		false ||
		(maksDato && d.isAfter(maksDato)) ||
		false
	);
};
