import * as P from 'parsimmon';
import { Mode } from './0.modes';

const urlParser: P.Parser<Mode> = P.of<Mode>({ mode: 'create' });

export function parseIt(url: string): Mode | null {
    const result = urlParser.parse(url);
    return result.status ? result.value : null;
}