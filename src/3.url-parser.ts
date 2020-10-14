import * as P from 'parsimmon';
import { guid } from './7.guid';
import { Mode } from './0.modes';

// const bookId = guid; 
const bookId = P.digit.atLeast(1).map(cs => cs.join(''));
const slash = P.string('/');
const create = P.string('/book');
const edit = create.then(slash).then(bookId);
const clone = edit.skip(slash).skip(P.string('clone'));

const urlParser: P.Parser<Mode> = 
    P.alt(
        clone.map<Mode>(id => ({ id, mode: 'clone' })), 
        edit.map<Mode>(id => ({ id, mode: 'edit' })),
        create.map<Mode>(_ => ({ mode: 'create' }))
    );

export function parseIt(url: string): Mode | null {
    const result = urlParser.parse(url);
    return result.status ? result.value : null;
}