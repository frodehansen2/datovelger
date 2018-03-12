declare module 'react-day-picker/DayPickerInput' {
	import * as React from 'react';
	import { ClassNames } from 'node_modules/react-day-picker/types/common';
	import { DayPickerInputProps } from 'node_modules/react-day-picker/types/props';
	import DayPicker from 'node_modules/react-day-picker/types/DayPicker';

	class DayPickerInput extends React.Component<DayPickerInputProps, any> {
		showDayPicker(): void;
		hideDayPicker(): void;
		getDayPicker(): DayPicker;
		getInput(): any;
	}
	export default DayPickerInput;
}
