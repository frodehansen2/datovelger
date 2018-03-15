import * as moment from 'moment';
import { getMånedDiff, dagDatoNøkkel } from '.';

type RefHTMLElement = HTMLElement | null;

export const getFokusertDato = (kalender: RefHTMLElement): Date | undefined => {
	if (kalender) {
		if (document.activeElement.classList.contains('DayPicker-Day')) {
			const dagElement = document.activeElement.childNodes.item(
				0
			) as HTMLElement;
			const dateAttr = dagElement.attributes.getNamedItem('data-date').value;
			return moment(dateAttr, 'DD.MM.YYYY').toDate();
		}
	}
	return undefined;
};

export const getSammeDatoIMåned = (
	dato: Date,
	måned: Date,
	nesteMåned: Date
): Date =>
	moment(dato)
		.add(getMånedDiff(nesteMåned, måned), 'months')
		.toDate();

export const fokuserPåDato = (kalender: RefHTMLElement, dato: Date) => {
	if (kalender) {
		const el: HTMLElement = kalender.querySelector(
			`[data-date="${dagDatoNøkkel(dato)}"]`
		) as HTMLElement;
		if (el) {
			(el.parentNode as HTMLElement).focus();
		}
	}
};

export const fokuserFørsteDagIMåned = (
	kalender: RefHTMLElement,
	måned: Date,
	evt: React.KeyboardEvent<any>
) => {
	evt.preventDefault();
	fokuserPåDato(
		kalender,
		moment(måned)
			.startOf('month')
			.toDate()
	);
};

export const fokuserSisteDagIMåned = (
	kalender: RefHTMLElement,
	måned: Date,
	evt: React.KeyboardEvent<any>
) => {
	evt.preventDefault();
	fokuserPåDato(
		kalender,
		moment(måned)
			.endOf('month')
			.toDate()
	);
};

export const fokuserKalender = (kalender: RefHTMLElement) => {
	if (kalender) {
		const selectedDay = kalender.querySelector(
			'.DayPicker-Day--selected'
		) as HTMLElement;
		const availableDay = kalender.querySelector(
			'.DayPicker-Day[aria-disabled=false],.DayPicker-Day--today'
		) as HTMLElement;
		if (selectedDay) {
			selectedDay.focus();
		} else if (availableDay) {
			availableDay.focus();
		} else {
			kalender.focus();
		}
	}
};
