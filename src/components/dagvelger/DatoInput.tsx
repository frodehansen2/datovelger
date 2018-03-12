import * as React from 'react';

export interface Props {
	id?: string;
	value?: string;
	placeholder?: string;
	disabled?: boolean;
}

interface State {
	value: string;
}

export class DatoInput extends React.Component<Props, State> {
	input: HTMLInputElement | null;

	constructor(props: Props) {
		super(props);
		this.focus = this.focus.bind(this);
		this.state = {
			value: props.value || ''
		};
	}

	componentWillReceiveProps(nextProps: Props) {
		this.setState({ value: nextProps.value || '' });
	}

	focus() {
		if (this.input) {
			this.input.focus();
		}
	}

	render() {
		const { value } = this.state;
		return (
			<input
				value={value}
				ref={(c) => (this.input = c)}
				className="nav-dagvelger__input"
				type="text"
				{...this.props}
			/>
		);
	}
}
export default DatoInput;
