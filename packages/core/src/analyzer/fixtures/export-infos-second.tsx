import * as React from 'react';

/**
 * @name SecondName
 */
export const BasicComponent: React.SFC = props => {
	return <div>{props.children}</div>;
};

/**
 * @name SecondNameClass
 */
export class BasicComponentClass extends React.Component {
	public render(): JSX.Element {
		return <div>Hello World</div>;
	}
}
