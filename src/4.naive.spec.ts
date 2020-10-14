type Result<T> = { value: T, rest: string };
type Parser<T> = (raw: string) => Result<T> | null;
type OperationSymbol = '+' | '-' | '*' | '/';
type Operation = (num1: number, num2: number) => number;











const digitChars = '0123456789';
const symbolChars = '+-*/';

function symbol2Operation(op: OperationSymbol): Operation {
    switch (op) {
        case '+': return (num1: number, num2: number) => num1 + num2;
        case '-': return (num1: number, num2: number) => num1 - num2;
        case '*': return (num1: number, num2: number) => num1 * num2;
        case '/': return (num1: number, num2: number) => num1 / num2;
    };
}




// === the building blocks ===

// the most basic parser: eats one character only
// a parser is just a function, remember the rhyme?
const char: Parser<string> = function (raw: string) {
    if (raw == null || raw.length === 0) return null;

    return { value: raw[0], rest: raw.substr(1) };
}






function satisfies<T>(
    predicate: (t: T) => boolean, 
    parser1: Parser<T>
    ): Parser<T> {

    // intercepts the result of parser1, 
    // and only returns the result if it satisfies the predicate
    const parser2: Parser<T> = function (raw: string) {
        const result = parser1(raw);
        if (result == null || !predicate(result.value)) return null;

        return result;
    };

    return parser2;
}





function many<T>(parser1: Parser<T>): Parser<T[]> {
    
    // keeps applying parser1 until it fails, 
    // and puts the good results in an array
    const parser2: Parser<T[]> = function next(rest: string, values: T[] = []): Result<T[]> {
        const result = parser1(rest);
        if (result == null) return { rest, value: values };

        return next(result.rest, values.concat([ result.value ]));
    };

    return parser2;
}




function map<T, U>(
    mapFn: (t: T) => U, 
    parser1: Parser<T>
    ): Parser<U> {
    
    // converts the result of parser1 from type T to type U
    const parser2: Parser<U> = function (raw: string) {
        const result = parser1(raw);
        return result == null
            ? null
            : { value: mapFn(result.value), rest: result.rest };
    };

    return parser2;
}





// === composing the building blocks ===
// guess what they are?

const digit: Parser<string> = 
    satisfies(
        str => digitChars.includes(str), 
        char
    );






const digits: Parser<string[]> = 
    satisfies(
        (ds: string[]) => ds.length > 0, 
        many(digit)
    );






const number: Parser<number> = 
    map(
        (ds: string[]) => Number(ds.join('')), 
        digits
    );






const symbol: Parser<string> =
    satisfies(
        (op: string) => symbolChars.includes(op),
        char
    );







const operation: Parser<Operation> =
    map(
        (op: string) => symbol2Operation(op as OperationSymbol),
        symbol
    );





    

function evaluate(raw: string): number | null {
    const result1 = number(raw);
    if (result1 == null) return null;

    const result2 = operation(result1.rest);
    if (result2 == null) return null;

    const result3 = number(result2.rest);
    if (result3 == null) return null;

    return result2.value(result1.value, result3.value);
}








describe('native parser', () => {
    const testcases: Record<string, number> = 
    {
        '12+34': 46,
        '34-12': 22,
        '34*2': 68,
        '34/2': 17
    };

    for (const raw in testcases) {
        const expected = testcases[raw];

        it(`Calculating ${raw} === ${expected}`, () => {
            const actual = evaluate(raw);
    
            expect(actual).toEqual(expected);
        });
    }
});