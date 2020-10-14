import P from 'parsimmon';

// <"age".21; "name"."Chris"; "from".<"street"."Queen St."; "number". 543>>
// 21
// "name"
type Entry = readonly [k: string, v: Angle];
type Angle = number | string | Array<Entry>;
function toObj(agl: Angle): any {
    if (Array.isArray(agl)) {
        return agl.reduce((obj, [k, v]) => ({ ...obj, [k]: toObj(v) }), {});
    }

    return agl;
}

const number = P.digit.atLeast(1).map(cs => Number(cs.join('')));
const quote = P.string('"');
const quoted = P.takeWhile(c => c !== '"')
                .wrap(quote, quote);

const kvp = (val: P.Parser<any>) => 
                P.seq(quoted, P.string('.'), val)
                .map(([k, _, v]) => [k, v] as const);
        
const separator = P.seq(P.string(';'), P.optWhitespace)
                    .map(cs => cs.join(''));

const obj = (val: P.Parser<any>) =>
                kvp(val).sepBy1(separator)
                .wrap(P.string('<'), P.string('>'))
                .map(toObj);

const angle: P.Parser<any> = 
    P.lazy(() => P.alt(
        number,
        quoted,
        obj(angle)
    ));

function parseIt(raw: string): Angle {
    const result = angle.parse(raw);

    if (result.status) return result.value;

    throw result;
} 

describe('angle parser', () => {
    let positives: Record<string, any> = {
        '1': 1,
        '"foo"': "foo",
        '<"age".21>': { age: 21 },
        '<"<age>".21>': { '<age>': 21 },
        '<"age".21; "name"."Chris"; "from".<"street"."Queen St."; "number".543>>':
            { age: 21, name: "Chris", from: { street: "Queen St.", number: 543 } }
    };

    const negatives: any[] = [
        ' ',
        true,
        '<>',
        '<21.21>',
        '<"age">',
        '<"age":21>',
        '<21',
        '21>',
    ];

    for (const raw in positives) {
        it(`Positive case ${raw}`, () => {
            const expected = positives[raw];
    
            const result = parseIt(raw);
            expect(result).toEqual(expected);
        });
    }

    for (const raw of negatives) {
        it(`Negative case ${raw}`, () => {
            expect(() => parseIt(raw)).toThrow();
        });
    }
});