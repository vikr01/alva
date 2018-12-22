import * as React from 'react';

export const BasicComponent: React.SFC = props => {
	return <div>{props.children}</div>;
};

export class BasicComponentClass extends React.Component {
	public render(): JSX.Element {
		return <div>Hello World</div>;
	}
}
