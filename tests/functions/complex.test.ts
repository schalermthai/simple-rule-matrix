import {rule, RuleSet} from "../../engine";
import {equalsTo} from "../../engine/predicates";
import {add, id, min} from "../../engine/functions";
import {deserialize} from "../../engine/marshaller";

describe('Mixing Complex Functions', () => {
    let rules: RuleSet;

    beforeAll(() => {
        rules = RuleSet.create(
            ['x'],
            ['result'],
            [
                rule(
                    [equalsTo(1)],
                    [() => add(1, id(min(5, 10)))]
                ),
                rule(
                    [equalsTo(2)],
                    [(inp) => min(inp['x'], add(4, id(-10)))]
                ),
                rule(
                    [equalsTo(3)],
                    [(inp) => id(min(add(inp['x'], -10), inp['x']))]
                ),
            ]
        );
    });

    test('evaluate rule 1', () => {
        const input = {x: 1};
        const result = rules.evaluate(input);
        expect(result).toEqual({"result": 6});
    });

    test('evaluate rule 2', () => {
        const input = {x: 2};
        const result = rules.evaluate(input);
        expect(result).toEqual({"result": -6});
    });

    test('evaluate rule 3', () => {
        const input = {x: 3};
        const result = rules.evaluate(input);
        expect(result).toEqual({"result": -7});
    });

    test('Serialization', () => {
        const serializedRules = rules.serialize();
        console.log(serializedRules)
        expect(serializedRules).toBe("{\"inputKeys\":[\"x\"],\"outputKeys\":[\"result\"],\"rules\":[{\"predicates\":[{\"type\":\"equalsTo\",\"value\":1}],\"result\":[{\"func\":\"add\",\"args\":[1,{\"func\":\"id\",\"args\":[{\"func\":\"min\",\"args\":[5,10]}]}]}]},{\"predicates\":[{\"type\":\"equalsTo\",\"value\":2}],\"result\":[{\"func\":\"min\",\"args\":[\"input['x']\",{\"func\":\"add\",\"args\":[4,{\"func\":\"id\",\"args\":[-10]}]}]}]},{\"predicates\":[{\"type\":\"equalsTo\",\"value\":3}],\"result\":[{\"func\":\"id\",\"args\":[{\"func\":\"min\",\"args\":[{\"func\":\"add\",\"args\":[\"input['x']\",-10]},\"input['x']\"]}]}]}]}");
    });

    test('Deserialization and Evaluation', () => {
        const serializedRules = rules.serialize();
        const deserializedRules = deserialize(serializedRules);

        let input = {x: 1};
        let result = deserializedRules.evaluate(input);
        expect(result).toEqual({"result": 6});

        input = {x: 2};
        result = rules.evaluate(input);
        expect(result).toEqual({"result": -6});

        input = {x: 3};
        result = rules.evaluate(input);
        expect(result).toEqual({"result": -7});

    });
});
