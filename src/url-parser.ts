import * as P from 'parsimmon';
import { guid } from './guid';
import { Mode } from './modes';

const slash = P.string('/');

// const bookId = guid; 
const bookId = P.digit.atLeast(1).tie();
const edit = slash.then(bookId);
const clone = edit.skip(slash).skip(P.string('clone'));

const urlParser: P.Parser<Mode> = 
    P.string('/book')
    .then(P.alt(
            clone.map<Mode>(id => ({ id, mode: 'clone' })), 
            edit.map<Mode>(id => ({ id, mode: 'edit' })),
            P.of<Mode>({ mode: 'create' })
        )
    )
    .skip(slash.or(P.of(null)));

export function parseIt(url: string): Mode | null {
    const result = urlParser.parse(url);
    return result.status ? result.value : null;
}