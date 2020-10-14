import { Mode } from './0.modes';
import { parseIt } from './2.url-regex';


const positives: Record<string, Mode> = {
    '/book':            { mode: 'create' },
    '/book/123':        { mode: 'edit', id: '123' },
    '/book/123/clone':  { mode: 'clone', id: '123' },
};




const negatives = [
    'book',
    'book/',
    '/book/',
    '/book123',
    '/bookclone',
    '/book/clone',
    '/book123clone',
    '/book123/clone'
];





describe('With positive cases', () => {
    for (const url in positives) {
        const expected = positives[url];
        const actual = parseIt(url);

        it(`Should parse ${url} to ${JSON.stringify(expected)}`, () => {
            expect(actual).toEqual(expected);
        });
    }
});

describe('With negative cases', () => {
    for (const url of negatives) {
        it(`Should parse ${url} to null`, () => {
            const actual = parseIt(url);

            expect(actual).toBeNull();
        });
    }
});