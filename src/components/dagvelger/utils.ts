import { DatovelgerAvgrensninger } from './types';
import * as moment from 'moment';
import { Moment } from 'moment';

export const normaliserDato = (d: Date): Moment => moment(d).startOf('day');

export const erDatoTilgjengelig = (
	d: Moment,
	angrensinger: DatovelgerAvgrensninger
): boolean => {
	d = normaliserDato(d.toDate()) as Moment;
	let blocked = false;

	if (angrensinger.helgedagerIkkeTillatt) {
		blocked = d.isoWeekday() === 6 || d.isoWeekday() === 7;
	}

	if (!blocked && angrensinger.ugyldigeTidsperioder) {
		angrensinger.ugyldigeTidsperioder.forEach((p) => {
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
