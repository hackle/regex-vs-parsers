type Result<T> = { value: T, rest: string };
type Parser<T> = (raw: string) => Result<T> | null;

const digitChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const symbolChars = ['+', '-', '*', '/'];
type OperationSymbol = '+' | '-' | '*' | '/';
type Operation = (num1: number, num2: number) => number;

const char: Parser<string> = function (raw: string) {
    if (raw == null || raw.length === 0) return null;

    const fstChar = raw[0];
    return fstChar == null 
        ? null
        : { value: fstChar, rest: raw.substr(1) };
}

function satisfies<T>(predicate: (t: T) => boolean, p: Parser<T>): Parser<T> {
    return function (raw: string) {
        const result = p(raw);
        if (result == null || !predicate(result.value)) return null;

        return result;
    };
}

function many<T>(p: Parser<T>): Parser<T[]> {
    return function next(rest: string, values: T[] = []): Result<T[]> {
        const result = p(rest);
        if (result == null) return { rest, value: values };

        return next(result.rest, values.concat([ result.value ]));
    };
}

function map<T, U>(fn: (t: T) => U, p: Parser<T>): Parser<U> {
    return (raw: string) => {
        const result = p(raw);
        return result == null
            ? null
            : { value: fn(result.value), rest: result.rest };
    };
}

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

function symbol2Operation(op: OperationSymbol): Operation {
    return {
        '+': (num1: number, num2: number) => num1 + num2,
        '-': (num1: number, num2: number) => num1 - num2,
        '*': (num1: number, num2: number) => num1 * num2,
        '/': (num1: number, num2: number) => num1 / num2,
    }[op];
}

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