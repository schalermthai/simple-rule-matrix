import {rule, RuleSet} from "../../engine";
import {equalsTo} from "../../engine/predicates";
import {add, min} from "../../engine/functions";

describe('Function Value Serializer', () => {
    let rules: RuleSet;

    describe('function statement', () =>{
        beforeAll(() => {
            const x = 100;
            const y = 300;
            rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(1)],
                        [function (inp) {}]
                    ),
                    rule(
                        [equalsTo(2)],
                        [function (inp) { return 1; }]

                    ),
                    rule(
                        [equalsTo(3)],
                        [function (inp) { return min(-1, inp['x']); }]
                    ),
                    rule(
                        [equalsTo(4)],
                        [function (inp) { return inp['x'] }]
                    ),
                ]
            );
        });

        test('function statement: evaluate rule 1', () => {
            const input = {x: 1};
            const result = rules.evaluate(input);
            expect(result).toEqual({result: undefined});
        });

        test('function statement: evaluate rule 2', () => {
            const input = {x: 2};
            const result = rules.evaluate(input);
            expect(result).toEqual({result: 1});
        });

        test('function statement: evaluate rule 3', () => {
            const input = {x: 3};
            const result = rules.evaluate(input);
            expect(result).toEqual({result: -1});
        });

        test('function statement: evaluate rule 4', () => {
            const input = {x: 4};
            const result = rules.evaluate(input);
            expect(result).toEqual({result: 4});
        });
    })

    describe('function expression with return block', () =>{
        beforeAll(() => {
            rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(1)],
                        [(inp) => {}]
                    ),
                    rule(
                        [equalsTo(2)],
                        [(inp) => { return 1; }]

                    ),
                    rule(
                        [equalsTo(3)],
                        [(inp) => { return min(-1, inp['x']); }]
                    )
                    ,
                    rule(
                        [equalsTo(4)],
                        [(inp) => {
                            return inp['x'] }]
                    )
                ]
            );
        });

        test('function expression with block: evaluate rule 1', () => {
            const input = {x: 1};
            const result = rules.evaluate(input);
            expect(result).toEqual({result: undefined});
        });

        test('function expression with block: evaluate rule 2', () => {
            const input = {x: 2};
            const result = rules.evaluate(input);
            expect(result).toEqual({result: 1});
        });

        test('function expression with block: evaluate rule 3', () => {
            const input = {x: 3};
            const result = rules.evaluate(input);
            expect(result).toEqual({result: -1});
        });

        test('function expression with block: evaluate rule 4', () => {
            const input = {x: 4};
            const result = rules.evaluate(input);
            expect(result).toEqual({result: 4});
        });
    })

    describe('function expression one-liner', () =>{
        beforeAll(() => {
            rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(1)],
                        [(inp) => {}]
                    ),
                    rule(
                        [equalsTo(2)],
                        [(inp) => 1]

                    ),
                    rule(
                        [equalsTo(3)],
                        [(inp) => min(-1, inp['x'])]
                    )
                    ,
                    rule(
                        [equalsTo(4)],
                        [(inp) => inp['x']]
                    )
                ]
            );
        });

        test('function expression with no block: evaluate rule 1', () => {
            const input = {x: 1};
            const result = rules.evaluate(input);
            expect(result).toEqual({result: undefined});
        });

        test('function expression with no block: evaluate rule 2', () => {
            const input = {x: 2};
            const result = rules.evaluate(input);
            expect(result).toEqual({result: 1});
        });

        test('function expression with no block: evaluate rule 3', () => {
            const input = {x: 3};
            const result = rules.evaluate(input);
            expect(result).toEqual({result: -1});
        });

        test('function expression with no block: evaluate rule 4', () => {
            const input = {x: 4};
            const result = rules.evaluate(input);
            expect(result).toEqual({result: 4});
        });
    })
})
