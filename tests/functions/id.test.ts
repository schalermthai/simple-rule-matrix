import {rule, RuleSet} from "../../engine";
import {equalsTo} from "../../engine/predicates";
import {id} from "../../engine/functions";
import {deserialize} from "../../engine/marshaller";

describe('Id Function', () => {
    let rules: RuleSet;

    beforeAll(() => {
        rules = RuleSet.create(
            ['x'],
            ['result'],
            [
                rule(
                    [equalsTo(1)],
                    [(inp) => id(inp['x'])]
                ),
                rule(
                    [equalsTo(2)],
                    [(inp) => inp['x']]
                ),
                rule(
                    [equalsTo(3)],
                    [() => id(3)]
                ),
            ]
        );
    });

    test('evaluate rule 1', () => {
        const input = {x: 1};
        const result = rules.evaluate(input);
        expect(result).toEqual({"result": 1});
    });

    test('evaluate rule 2', () => {
        const input = {x: 2};
        const result = rules.evaluate(input);
        expect(result).toEqual({"result": 2});
    });

    test('evaluate rule 3', () => {
        const input = {x: 3};
        const result = rules.evaluate(input);
        expect(result).toEqual({"result": 3});
    });

    test('Serialization', () => {
        const serializedRules = rules.serialize();
        console.log(serializedRules)
        expect(serializedRules).toBe("{\"inputKeys\":[\"x\"],\"outputKeys\":[\"result\"],\"rules\":[{\"predicates\":[{\"type\":\"equalsTo\",\"value\":1}],\"result\":[{\"func\":\"id\",\"args\":[\"input['x']\"]}]},{\"predicates\":[{\"type\":\"equalsTo\",\"value\":2}],\"result\":[{\"func\":\"id\",\"args\":[\"input['x']\"]}]},{\"predicates\":[{\"type\":\"equalsTo\",\"value\":3}],\"result\":[{\"func\":\"id\",\"args\":[3]}]}]}");
    });

    test('Deserialization and Evaluation', () => {
        const serializedRules = rules.serialize();
        const deserializedRules = deserialize(serializedRules);

        let input = {x: 1};
        let result = deserializedRules.evaluate(input);
        expect(result).toEqual({"result": 1});

        input = {x: 2};
        result = rules.evaluate(input);
        expect(result).toEqual({"result": 2});

        input = {x: 3};
        result = rules.evaluate(input);
        expect(result).toEqual({"result": 3});
    });
});
