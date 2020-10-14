import P from 'parsimmon';

const dash: P.Parser<string>    = P.string('-');
const hexChar: P.Parser<string> = P.oneOf('0123456789abcdef');

function hex(len: number): P.Parser<string> {
    return hexChar.times(len)
                  .map(cs => cs.join(''));
}






// or? /^[a-z0-9]{8}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{12}$/
export const guid = P.seq(
    hex(8), dash,
    hex(4), dash,
    hex(4), dash,
    hex(4), dash,
    hex(12)
).map(cs => cs.join(''));