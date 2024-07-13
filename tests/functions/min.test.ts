import {rule, RuleSet} from "../../engine";
import {equalsTo} from "../../engine/predicates";
import {min} from "../../engine/functions";
import {deserialize} from "../../engine/marshaller";

describe('Min Function', () => {
    let rules: RuleSet;

    beforeAll(() => {
        rules = RuleSet.create(
            ['x'],
            ['result'],
            [
                rule(
                    [equalsTo(1)],
                    [(i) => min(i['x'], 2)]
                ),
                rule(
                    [equalsTo(2)],
                    [(inp) => min(inp['x'], -2)]
                ),
                rule(
                    [equalsTo(3)],
                    [(inp) => min(inp['x'], inp['x'])]
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
        expect(result).toEqual({"result": -2});
    });

    test('evaluate rule 3', () => {
        const input = {x: 3};
        const result = rules.evaluate(input);
        expect(result).toEqual({"result": 3});
    });

    test('Serialization', () => {
        const serializedRules = rules.serialize();
        console.log(serializedRules)
        expect(serializedRules).toBe("{\"inputKeys\":[\"x\"],\"outputKeys\":[\"result\"],\"rules\":[{\"predicates\":[{\"type\":\"equalsTo\",\"value\":1}],\"result\":[{\"func\":\"min\",\"args\":[\"input['x']\",2]}]},{\"predicates\":[{\"type\":\"equalsTo\",\"value\":2}],\"result\":[{\"func\":\"min\",\"args\":[\"input['x']\",-2]}]},{\"predicates\":[{\"type\":\"equalsTo\",\"value\":3}],\"result\":[{\"func\":\"min\",\"args\":[\"input['x']\",\"input['x']\"]}]}]}");
    });

    test('Deserialization and Evaluation', () => {
        const serializedRules = rules.serialize();
        const deserializedRules = deserialize(serializedRules);

        let input = {x: 1};
        let result = deserializedRules.evaluate(input);
        expect(result).toEqual({"result": 1});

        input = {x: 2};
        result = rules.evaluate(input);
        expect(result).toEqual({"result": -2});

        input = {x: 3};
        result = rules.evaluate(input);
        expect(result).toEqual({"result": 3});

    });
});
