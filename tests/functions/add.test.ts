import {rule, RuleSet} from "../../engine";
import {equalsTo,} from "../../engine/predicates";
import {add} from "../../engine/functions";
import {deserialize} from "../../engine/marshaller";

describe('Add Function', () => {
    let rules: RuleSet;

    beforeAll(() => {
        rules = RuleSet.create(
            ['x'],
            ['result'],
            [
                rule(
                    [equalsTo(1)],
                    [() => add(1, 2)]
                ),
                rule(
                    [equalsTo(2)],
                    [(inp) => add(inp['x'], 2)]
                ),
                rule(
                    [equalsTo(3)],
                    [(inp) => add(inp['x'], inp['x'])]
                ),
            ]
        );
    });

    test('evaluate rule 1', () => {
        const input = {x: 1};
        const result = rules.evaluate(input);
        expect(result).toEqual({"result": 3});
    });

    test('evaluate rule 2', () => {
        const input = {x: 2};
        const result = rules.evaluate(input);
        expect(result).toEqual({"result": 4});
    });

    test('evaluate rule 3', () => {
        const input = {x: 3};
        const result = rules.evaluate(input);
        expect(result).toEqual({"result": 6});
    });

    test('Serialization', () => {
        const serializedRules = rules.serialize();
        console.log(serializedRules)
        expect(serializedRules).toBe("{\"inputKeys\":[\"x\"],\"outputKeys\":[\"result\"],\"rules\":[{\"predicates\":[{\"type\":\"equalsTo\",\"value\":1}],\"result\":[{\"func\":\"add\",\"args\":[1,2]}]},{\"predicates\":[{\"type\":\"equalsTo\",\"value\":2}],\"result\":[{\"func\":\"add\",\"args\":[\"input['x']\",2]}]},{\"predicates\":[{\"type\":\"equalsTo\",\"value\":3}],\"result\":[{\"func\":\"add\",\"args\":[\"input['x']\",\"input['x']\"]}]}]}");
    });

    test('Deserialization and Evaluation', () => {
        const serializedRules = rules.serialize();
        const deserializedRules = deserialize(serializedRules);

        let input = {x: 1};
        let result = deserializedRules.evaluate(input);
        expect(result).toEqual({"result": 3});

        input = {x: 2};
        result = rules.evaluate(input);
        expect(result).toEqual({"result": 4});

        input = {x: 3};
        result = rules.evaluate(input);
        expect(result).toEqual({"result": 6});

    });
});
