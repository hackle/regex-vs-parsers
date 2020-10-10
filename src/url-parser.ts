import * as P from 'parsimmon';
import { Mode } from './modes';

const urlParser: P.Parser<Mode|null> = P.of(null);
export function parseIt(url: string): Mode | null {
    const result = urlParser.parse(url);
    return result.status ? result.value : null;
}