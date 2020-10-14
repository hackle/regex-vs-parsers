import P from 'parsimmon';

type Operator = '+'|'-'|'*'|'/';
type Operation = (n1: number, n2: number) => number;

function toOperation(op: Operator): Operation {
    switch (op) {
        case '+': return (num1: number, num2: number) => num1 + num2;
        case '-': return (num1: number, num2: number) => num1 - num2;
        case '*': return (num1: number, num2: number) => num1 * num2;
        case '/': return (num1: number, num2: number) => num1 / num2;
    };
}





const number: P.Parser<number> = 
    P.digit
    .atLeast(1)
    .map(cs => Number(cs.join('')));






const operation: P.Parser<Operation> = 
    P.oneOf('+-*/')
    .map(x => toOperation(x as Operator));






const arithmetic: P.Parser<number> = 
    P.seq(
        number,
        operation,
        number
    ).map(([n1, opFn, n2]) => opFn(n1, n2));







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
