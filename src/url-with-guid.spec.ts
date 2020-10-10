import { Mode } from './modes';
import { parseIt } from './url-parser';

const positives: Record<string, Mode> = {
    '/book': { mode: 'create' },
    '/book/': { mode: 'create' },
    '/book/90c5dda4-b1a3-4b77-9247-3efd3f80e4c3': { mode: 'edit', id: '90c5dda4-b1a3-4b77-9247-3efd3f80e4c3' },
    '/book/f2f7135c-2a16-4653-afba-ebec70f1d378/': { mode: 'edit', id: 'f2f7135c-2a16-4653-afba-ebec70f1d378' },
    '/book/1165cecd-3872-45e1-8d17-cea71bc0ee68/clone': { mode: 'clone', id: '1165cecd-3872-45e1-8d17-cea71bc0ee68' },
    '/book/db4c8b7e-2e8a-40fa-a922-16efff3c7b23/clone/': { mode: 'clone', id: 'db4c8b7e-2e8a-40fa-a922-16efff3c7b23' }
};

const negatives = [
    '/book//',
    '/bookdb4c8b7e-2e8a-40fa-a922-16efff3c7b23',
    '/bookclone',
    '/bookdb4c8b7e-2e8a-40fa-a922-16efff3c7b23clone',
    '/bookdb4c8b7e-2e8a-40fa-a922-16efff3c7b23/clone'
];

describe('GUID: With positive cases', () => {
    for (const url in positives) {
        it(`Parsing ${url}`, () => {
            const expected = positives[url];
            const actual = parseIt(url);

            expect(actual).toEqual(expected);
        });
    }
});

describe('GUID: With negative cases', () => {
    for (const url of negatives) {
        it(`Parsing ${url}`, () => {
            const actual = parseIt(url);

            expect(actual).toBeNull();
        });
    }
});