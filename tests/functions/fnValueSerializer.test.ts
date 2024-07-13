import {rule, RuleSet} from "../../engine";
import {equalsTo} from "../../engine/predicates";
import {add, min} from "../../engine/functions";
import {deserialize, serializer} from "../../engine/marshaller";

describe('Function Value Serializer', () => {

    describe('function statement', () =>{

        test('function statement: evaluate rule 1', () => {
            const input = {x: 1};
            const rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(1)],
                        [function (inp) {}]
                    ),
                ]
            )
            expect(() => deserialize(serializer(rules)).evaluate(input))
                .toThrow('Function must return a value. Function with multiple statements are not supported');
        });

        test('function statement: evaluate rule 2', () => {
            const input = {x: 2};
            const rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(2)],
                        [ function (inp) { return 2; }]

                    ),

                ]
            )

            const serialized = serializer(rules);
            console.log(serialized)
            expect(serialized).toEqual(`{"inputKeys":["x"],"outputKeys":["result"],"rules":[{"predicates":[{"type":"equalsTo","value":2}],"result":[{"func":"id","args":[2]}]}]}`);
            expect(deserialize(serialized).evaluate(input)).toEqual(rules.evaluate(input));
        });

        test('function statement: evaluate rule 3', () => {
            const input = {x: 3};
            const rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(3)],
                            [function (inp) { return min(-1, inp['x']); }]
                    ),

                ]
            )
            const serialized = serializer(rules);
            console.log(serialized)
            expect(serialized).toEqual(`{"inputKeys":["x"],"outputKeys":["result"],"rules":[{"predicates":[{"type":"equalsTo","value":3}],"result":[{"func":"min","args":[-1,"input['x']"]}]}]}`);
            expect(deserialize(serialized).evaluate(input)).toEqual(rules.evaluate(input));
        });

        test('function statement: evaluate rule 4', () => {
            const input = {x: 4};
            const rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(4)],
                        [function (inp) {
                            return inp['x'] }]
                    )
                ]
            )
            const serialized = serializer(rules);
            console.log(serialized)
            expect(serialized).toEqual(`{"inputKeys":["x"],"outputKeys":["result"],"rules":[{"predicates":[{"type":"equalsTo","value":4}],"result":[{"func":"id","args":["input['x']"]}]}]}`);
            expect(deserialize(serialized).evaluate(input)).toEqual(rules.evaluate(input));
        });

        test('function statement: evaluate rule 5', () => {
            const input = {x: 5};
            const rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(5)],
                        [function (inp) {
                            const x = 100;
                            return 1 }]
                    )
                ]
            )
            expect(() =>  serializer(rules)).toThrow('Function must return a value. Function with multiple statements are not supported');
        });
    })

    describe('expression statement with block', () =>{

        test('expression statement with block: evaluate rule 1', () => {
            const input = {x: 1};
            const rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(1)],
                        [ (inp) => {}]
                    ),
                ]
            )
            expect(() => deserialize(serializer(rules)).evaluate(input))
                .toThrow('Function must return a value. Function with multiple statements are not supported');
        });

        test('expression statement with block: evaluate rule 2', () => {
            const input = {x: 2};
            const rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(2)],
                        [  (inp) => { return 2; }]

                    ),

                ]
            )

            const serialized = serializer(rules);
            console.log(serialized)
            expect(serialized).toEqual(`{"inputKeys":["x"],"outputKeys":["result"],"rules":[{"predicates":[{"type":"equalsTo","value":2}],"result":[{"func":"id","args":[2]}]}]}`);
            expect(deserialize(serialized).evaluate(input)).toEqual(rules.evaluate(input));
        });

        test('expression statement with block: evaluate rule 3', () => {
            const input = {x: 3};
            const rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(3)],
                        [ (inp) => { return min(-1, inp['x']); }]
                    ),

                ]
            )
            const serialized = serializer(rules);
            console.log(serialized)
            expect(serialized).toEqual(`{"inputKeys":["x"],"outputKeys":["result"],"rules":[{"predicates":[{"type":"equalsTo","value":3}],"result":[{"func":"min","args":[-1,"input['x']"]}]}]}`);
            expect(deserialize(serialized).evaluate(input)).toEqual(rules.evaluate(input));
        });

        test('expression statement with block: evaluate rule 4', () => {
            const input = {x: 4};
            const rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(4)],
                        [ (inp) => {
                            return inp['x'] }]
                    )
                ]
            )
            const serialized = serializer(rules);
            console.log(serialized)
            expect(serialized).toEqual(`{"inputKeys":["x"],"outputKeys":["result"],"rules":[{"predicates":[{"type":"equalsTo","value":4}],"result":[{"func":"id","args":["input['x']"]}]}]}`);
            expect(deserialize(serialized).evaluate(input)).toEqual(rules.evaluate(input));
        });

        test('expression statement with block: evaluate rule 5', () => {
            const input = {x: 5};
            const rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(5)],
                        [ (inp) => {
                            const x = 100;
                            return 1 }]
                    )
                ]
            )
            expect(() =>  serializer(rules)).toThrow('Function must return a value. Function with multiple statements are not supported');
        });
    })

    describe('expression statement with no block', () =>{

        test('expression statement with no block: evaluate rule 1', () => {
            const input = {x: 1};
            const rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(1)],
                        [ (inp) => undefined]
                    ),
                ]
            )
            expect(() => serializer(rules))
                .toThrow('Function must return a value. Function with multiple statements are not supported');
        });

        test('expression statement with no block: evaluate rule 2', () => {
            const input = {x: 2};
            const rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(2)],
                        [  (inp) =>  2]

                    ),

                ]
            )

            const serialized = serializer(rules);
            console.log(serialized)
            expect(serialized).toEqual(`{"inputKeys":["x"],"outputKeys":["result"],"rules":[{"predicates":[{"type":"equalsTo","value":2}],"result":[{"func":"id","args":[2]}]}]}`);
            expect(deserialize(serialized).evaluate(input)).toEqual(rules.evaluate(input));
        });

        test('expression statement with no block: evaluate rule 3', () => {
            const input = {x: 3};
            const rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(3)],
                        [ (inp) =>  min(-1, inp['x'])]
                    ),

                ]
            )
            const serialized = serializer(rules);
            console.log(serialized)
            expect(serialized).toEqual(`{"inputKeys":["x"],"outputKeys":["result"],"rules":[{"predicates":[{"type":"equalsTo","value":3}],"result":[{"func":"min","args":[-1,"input['x']"]}]}]}`);
            expect(deserialize(serialized).evaluate(input)).toEqual(rules.evaluate(input));
        });

        test('expression statement with no block: evaluate rule 4', () => {
            const input = {x: 4};
            const rules = RuleSet.create(
                ['x'],
                ['result'],
                [
                    rule(
                        [equalsTo(4)],
                        [ (inp) => inp['x'] ]
                    )
                ]
            )
            const serialized = serializer(rules);
            console.log(serialized)
            expect(serialized).toEqual(`{"inputKeys":["x"],"outputKeys":["result"],"rules":[{"predicates":[{"type":"equalsTo","value":4}],"result":[{"func":"id","args":["input['x']"]}]}]}`);
            expect(deserialize(serialized).evaluate(input)).toEqual(rules.evaluate(input));
        });
    })
})
