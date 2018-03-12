import * as React from 'react';
import { LocaleUtils } from 'react-day-picker/types/utils';

interface Props {
	date: Date;
	localeUtils: LocaleUtils;
	locale: string;
}

const lagCaption = (props: Props) =>
	props.localeUtils.formatMonthTitle(props.date, props.locale);

export class AktivManed extends React.Component<Props, {}> {
	shouldComponentUpdate(nextProps: any) {
		return lagCaption(nextProps) !== lagCaption(this.props);
	}
	render() {
		return (
			<div className="DayPicker-Caption" aria-live="assertive" role="header">
				{lagCaption(this.props)}
			</div>
		);
	}
}

export default AktivManed;
