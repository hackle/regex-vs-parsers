import P from 'parsimmon';


/* 
these are all valid
<"age".21; "name"."Chris"; "from".<"street"."Queen St."; "number". 543>>
21
"name"
 
!mind the recursion!
*/
type Entry = [k: string, v: Angle];
type Angle = number | string | Array<Entry>;






// convert an Angle to an object recursively
function angleToObject(agl: Angle): any {
    if (Array.isArray(agl)) {
        return agl.reduce((obj, [k, v]) => ({ ...obj, [k]: angleToObject(v) }), {});
    }

    return agl;
}





// an old friend!
const number: P.Parser<number> = 
    P.digit
    .atLeast(1)
    .map(cs => Number(cs.join('')));






const quote: P.Parser<string> = P.string('"');

// disclaimer: escaped quotes note accounted for
const quotedString: P.Parser<string> = 
    P.takeWhile(c => c !== '"')
    .wrap(quote, quote);





// note: child can be a nested Angle object
function kvp(child: P.Parser<Angle>): P.Parser<Entry> {
    return P.seq(
        quotedString, 
        P.string('.'), 
        child
    ).map(([k, _, v]) => [k, v] as Entry); // the dot is ignored
}
        



const separator = P.seq(P.string(';'), P.optWhitespace)
                    .map(cs => cs.join(''));

// many children separated by separator, 
// wrapped in angle brackets
// then converted to an object
function obj(child: P.Parser<Angle>): P.Parser<Angle> {
    return kvp(child).sepBy1(separator)
            .wrap(P.string('<'), P.string('>'))
            .map(angleToObject);
}




// bringing it all together!
// lazy() is what makes recursion possible
// see how "angle" is used to define itself
const angle: P.Parser<any> = 
    P.lazy(() => P.alt(
        number,
        quotedString,
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
        const expected = positives[raw];

        it(`Parsed ${raw} to ${JSON.stringify(expected)}`, () => {    
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