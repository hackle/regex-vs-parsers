import P from 'parsimmon';

const dash = P.string('-');
const hexChar = P.oneOf('0123456789abcdef');
const hex = (len: number) => hexChar.times(len).map(cs => cs.join(''));

export const guid = P.seq(
    hex(8), dash,
    hex(4), dash,
    hex(4), dash,
    hex(4), dash,
    hex(12)
).map(cs => cs.join(''));