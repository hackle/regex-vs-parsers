import P from 'parsimmon';

type Operator = '+'|'-'|'*'|'/';
type Operation = (n1: number, n2: number) => number;

function getOperation(op: Operator): Operation {
    return {
        '+': (n1: number, n2: number) => n1 + n2,
        '-': (n1: number, n2: number) => n1 - n2,
        '*': (n1: number, n2: number) => n1 * n2,
        '/': (n1: number, n2: number) => n1 / n2,
    }[op];
}

const number = P.digit
                .atLeast(1)
                .map(digits => Number(digits.join('')));
                
const operation = P.oneOf('+-*/')
                   .map(x => getOperation(x as Operator));

// 12+34 
const arithmetic = 
    P.seq(
        number,
        operation,
        number
    ).map(([n1, op, n2]) => op(n1, n2));

function calc(raw: string): number | null {
    const result = arithmetic.parse(raw);

    return result.status ? result.value : null;
}

describe('Arithmetic', () => {
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
            const actual = calc(raw);
    
            expect(actual).toEqual(expected);
        });
    }
});
