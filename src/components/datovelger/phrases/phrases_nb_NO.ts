import { DatovelgerPhrases, FraseDato } from '../types';

const fraserBokmal: DatovelgerPhrases = {
	calendarLabel: 'Kalender',
	closeDatePicker: 'Lukk',
	clearDate: 'Fjern dato',
	jumpToPrevMonth: 'Gå tilbake for å se forrige måned.',
	jumpToNextMonth: 'Gå fremover for å se neste måned',
	keyboardShortcuts: 'Hurtigtaster',
	showKeyboardShortcutsPanel: 'Vis informasjon om hurtigtaster',
	hideKeyboardShortcutsPanel: 'Lukk informasjon om hurtigtaster',
	openThisPanel: 'Åpne dette panelet',
	enterKey: 'Enter',
	leftArrowRightArrow: 'Høyre og venstre piltaster',
	upArrowDownArrow: 'opp og ned piltaster',
	pageUpPageDown: 'side side og side ned taster',
	homeEnd: 'Hjem og slutt taster',
	escape: 'Escape',
	questionMark: 'Spørsmålstegn',
	selectFocusedDate: 'Velg datoen som har fokus',
	moveFocusByOneDay: 'Gå tilbake (venstre) og fremover (høyre) med én dag',
	moveFocusByOneWeek: 'Gå tilbake (opp) og fremover (ned) med én uke',
	moveFocusByOneMonth: 'Bytt måneder',
	moveFocustoStartAndEndOfWeek: 'Gå til den første eller siste dagen i uka',
	returnFocusToInput: 'Gå tilbake til dato-inputfeltet',
	keyboardNavigationInstructions: `Trykk ned piltasten for å navigere i kalenderen og velge en dato. Trykk spørsmålstegnet for å se en oversikt over hurtigtaster.`,
	chooseAvailableDate: ({ date }: FraseDato) => date,
	dateIsUnavailable: ({ date }: FraseDato) => `Ikke tilgjengelig. ${date}`,
	dateIsSelected: ({ date }: FraseDato) => `Valgt. ${date}`
};

export default fraserBokmal;
