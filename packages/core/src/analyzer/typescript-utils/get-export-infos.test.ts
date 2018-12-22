import * as Tsa from 'ts-simple-ast';
import * as Ts from 'typescript';
import { getExportInfos } from './get-export-infos';
import { isExport } from './is-export';

const fixtures = require('fixturez')(__dirname);

let project: Tsa.Project;
let sourceFileVariableFirst: Tsa.SourceFile;
let sourceFileVariableSecond: Tsa.SourceFile;

beforeAll(() => {
	const fixturePathVariableFirst = fixtures.find('export-infos/variable-first.tsx');
	const fixturePathVariableSecond = fixtures.find('export-infos/variable-second.tsx');
	// const fixturePathClassFirst = fixtures.find('export-infos/class-first.tsx');
	// const fixturePathClassSecond = fixtures.find('export-infos/class-second.tsx');
	project = new Tsa.Project();
	project.addExistingSourceFile(fixturePathVariableFirst);
	project.addExistingSourceFile(fixturePathVariableSecond);
	sourceFileVariableFirst = project.getSourceFileOrThrow('export-infos/variable-first.tsx');
	sourceFileVariableSecond = project.getSourceFileOrThrow('export-infos/variable-second.tsx');
	// sourceFileClassFirst = project.getSourceFileOrThrow('export-infos/variable-first.tsx');
	// sourceFileClassSecond = project.getSourceFileOrThrow('export-infos/variable-second.tsx');
});

test('keep export name independent of meta data: variable statement & class declaration', () => {
	const program = (project.getProgram().compilerObject as any) as Ts.Program;

	const firstExport = sourceFileVariableFirst
		.getStatements()
		.find(s => Tsa.TypeGuards.isExportableNode(s))!.compilerNode;

	const secondExport = sourceFileVariableSecond
		.getStatements()
		.find(s => Tsa.TypeGuards.isExportableNode(s))!.compilerNode;

	const [firstExportInfo] = getExportInfos(program, firstExport);
	const [secondExportInfo] = getExportInfos(program, secondExport);

	expect(firstExportInfo).toEqual(
		expect.objectContaining({
			exportName: secondExportInfo.exportName
		})
	);
});
