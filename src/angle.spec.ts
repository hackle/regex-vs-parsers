import P from 'parsimmon';

// <"age".21; "name"."Chris"; "from".<"street"."Queen St."; "number". 543>>
// 21
// "name"
type Angle = number | string | [k: string, v: Angle][];
function toObj(agl: Angle): any {
    if (Array.isArray(agl)) {
        return agl.reduce((obj, [k, v]) => ({ ...obj, [k]: toObj(v) }), {});
    }

    return agl;
}

const number = P.digit.atLeast(1).tie().map(Number);
const quoted = P.string('"')
                .then(P.takeWhile(c => c !== '"'))
                .skip(P.string('"'));

const kvp = 
    (a: P.Parser<any>) => 
        P.seq(quoted.skip(P.string('.')), a);
        
const obj = 
    (a: P.Parser<any>) =>
        P.string('<')
         .then(kvp(a).sepBy1(P.string(';').then(P.optWhitespace)))
         .skip(P.string('>'))
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