import * as Model from '../model';
import * as Types from '../types';
import * as uuid from 'uuid';
test('get and render element actions', () => {
	const project = Model.Project.create({
		name: 'test',
		path: 'my/path',
		draft: true
	});
	const libraries = Model.Project.createBuiltinPatternLibrary();
	const patterns = libraries.getPatterns();
	const linkPattern = patterns.filter(p => p.getType() === Types.PatternType.SyntheticLink);
	const mockElement = Model.Element.fromPattern(linkPattern[0], {
		dragged: false,
		contents: [],
		project
	});
	const mockPropId = linkPattern[0].getId();
	mockElement.setPropertyValue(mockPropId, [uuid.v4().toString()]);
	const elementAction = project.getElementActionById(mockElement.getPropertyValue(
		mockPropId
	) as string);
	const mockActionId = jest.fn(id => id);
	mockActionId(mockElement.getPropertyValue(mockPropId));

	expect(mockActionId).toReturnWith(mockElement.getPropertyValue(mockPropId)[0] as string);
	expect(elementAction).toBe(!undefined);
});
