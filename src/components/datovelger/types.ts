export interface DatovelgerTidsperiode {
	/** Dato fra og med */
	startdato: Date;
	/** Dato til og med */
	sluttdato: Date;
}

export interface DatovelgerAvgrensninger {
	/** Første valgbare dato */
	minDato?: Date;
	/** Siste valgbare dato */
	maksDato?: Date;
	/** Tidsperioder som en ikke skal kunne velge */
	ugyldigeTidsperioder?: DatovelgerTidsperiode[];
	/** Om bruker skal kunne velge lørdag eller søndag. Default true  */
	helgedagerIkkeTillatt?: boolean;
}
