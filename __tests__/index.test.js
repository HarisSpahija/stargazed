import stargazed, { validate, htmlEscapeTable, getReadmeTemplate, buildReadmeContent, buildWorkflowContent } from '..';
import '@testing-library/jest-dom/extend-expect';

import { inputContent, badInputToken, goodInputRepo } from '../mock/contentInput';

const pckg = require('../package.json');

describe('Commands functional tests', () => {
	test('should check basic input behavior of core function', async () => {
		const response = await stargazed({
			username: 'Jean-Luc-Picard',
			token: '1701-D',
			repo: 'Enterprise',
			message: 'Make it so...',
			sort: true,
			workflow: true,
			version: true,
		});

		expect(response).toBe(pckg.version);
	});
	test('should static check htmlEscapeTable mapping', async () => {
		expect(htmlEscapeTable['>']).toBe('&gt;');
		expect(htmlEscapeTable['<']).toBe('&lt;');
		expect(htmlEscapeTable['[|]']).toBe('\\|');
		expect(htmlEscapeTable['\n']).toBe('');
	});
	test('should show positive getReadmeTemplate() outcome', async () => {
		const template = await getReadmeTemplate();

		expect(template).toBeTruthy();
		expect(template.slice(0, 9)).toBe('# Awesome');
		expect(template.length > 10).toBe(true);
	});
	test('should show positive buildReadmeContent(context) outcome', async () => {
		const response = await buildReadmeContent(inputContent);

		expect(response.match('Klingon')[0]).toBe('Klingon');
		expect(response.match('English')[0]).toBe('English');
		expect(response.match('Vulcan')[0]).toBe('Vulcan');
		expect(response.match('JavaScript')[0]).toBe('JavaScript');
	});
	test('should show that the data is mapped for workflow content', async () => {
		const response = await buildWorkflowContent('Jean-Luc-Picard', 'mock-repository');

		expect(response).toBeTruthy();
		expect(response).toContain('cron');
		expect(response).toContain('Jean-Luc-Picard');
		expect(response.length > 0).toBe(true);
	});
	test('should check validation good input/output - positive branch return null', async () => {
		expect(validate(goodInputRepo)).toBeNull();
	});
	test('should check bad inputs in validation behavior/paths', () => {
		const badTokenRes = validate(badInputToken);
		const fn = () => {
			throw badTokenRes;
		};
		expect(fn).toThrowError(new TypeError(`invalid option. Token must be a string primitive.`));
	});
	// test('should ', async () => {
	// });
});
