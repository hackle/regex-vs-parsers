import { Mode } from './modes';
import { parseIt } from './url-regex';

const positives: Record<string, Mode> = {
    '/book':            { mode: 'create' },
    '/book/':           { mode: 'create' },
    '/book/123':        { mode: 'edit', id: '123' },
    '/book/123/':       { mode: 'edit', id: '123' },
    '/book/123/clone':  { mode: 'clone', id: '123' },
    '/book/123/clone/': { mode: 'clone', id: '123' }
};

const negatives = [
    '/book//',
    '/book123',
    '/bookclone',
    '/book123clone',
    '/book123/clone'
];

describe('With positive cases', () => {
    for (const url in positives) {
        it(`Parsing ${url}`, () => {
            const expected = positives[url];
            const actual = parseIt(url);

            expect(actual).toEqual(expected);
        });
    }
});

describe('With negative cases', () => {
    for (const url of negatives) {
        it(`Parsing ${url}`, () => {
            const actual = parseIt(url);

            expect(actual).toBeNull();
        });
    }
});