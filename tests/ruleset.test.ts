import {RuleSet} from "../engine";
import {equalsTo, greaterThan, inList, lessThan} from "../engine/predicates";
import {add, min} from "../engine/functions";
import {deserialize, serializer} from "../engine/marshaller";
import {rule} from "../engine/Rule";


describe('Rule Engine', () => {
    let rules: RuleSet;

    beforeAll(() => {
        rules = RuleSet.create(
            ['x', 'y', 'z'],
            ['a', 'b', 'c'],
            [
                rule(
                    [greaterThan(30), equalsTo(10), inList([1, 2, 3])],
                    ['1', '2', '3']
                ),
                rule(
                    [lessThan(30), equalsTo(10), inList([4, 5, 6])],
                    [(inp) => add(min(-1, inp['x']), 100), '5', '6']
                ),
                rule(
                    [greaterThan(30), lessThan(10), inList([7, 8, 9])],
                    ['7', '8', '9']
                )
            ]
        );
    });

    test('evaluate rule 1', () => {
        const input = {x: 40, y: 10, z: 3};
        const result = rules.evaluate(input);
        expect(result).toEqual({"a": "1", "b": "2", "c": "3"});
    });

    test('evaluate rule 2', () => {

        const input = {x: 25, y: 10, z: 5};
        const result = rules.evaluate(input)
        expect(result).toEqual({a: 99, b: '5', c: '6'});
    });

    test('Serialization', () => {
        const serializedRules = rules.serialize();
        console.log(serializedRules)
        expect(serializedRules).toBe("{\"inputKeys\":[\"x\",\"y\",\"z\"],\"outputKeys\":[\"a\",\"b\",\"c\"],\"rules\":[{\"predicates\":[{\"type\":\"greaterThan\",\"value\":30},{\"type\":\"equalsTo\",\"value\":10},{\"type\":\"inList\",\"value\":[1,2,3]}],\"result\":[{\"value\":\"1\"},{\"value\":\"2\"},{\"value\":\"3\"}]},{\"predicates\":[{\"type\":\"lessThan\",\"value\":30},{\"type\":\"equalsTo\",\"value\":10},{\"type\":\"inList\",\"value\":[4,5,6]}],\"result\":[{\"func\":\"add\",\"args\":[{\"func\":\"min\",\"args\":[-1,\"input['x']\"]},100]},{\"value\":\"5\"},{\"value\":\"6\"}]},{\"predicates\":[{\"type\":\"greaterThan\",\"value\":30},{\"type\":\"lessThan\",\"value\":10},{\"type\":\"inList\",\"value\":[7,8,9]}],\"result\":[{\"value\":\"7\"},{\"value\":\"8\"},{\"value\":\"9\"}]}]}");
    });

    test('Deserialization and Evaluation', () => {
        const serializedRules = rules.serialize();
        const deserializedRules = deserialize(serializedRules);

        const input = {x: 40, y: 10, z: 3};
        expect(deserializedRules.evaluate(input)).toEqual({"a": "1", "b": "2", "c": "3"});

    });

    test('Evaluation with different input', () => {
        const serializedRules = rules.serialize();
        const deserializedRules = deserialize(serializedRules);

        const input = {x: 25, y: 10, z: 5};
        expect(deserializedRules.evaluate(input)).toEqual({a: 99, b: '5', c: '6'});
    });

    test('No matching rule', () => {
        const serializedRules = rules.serialize();
        const deserializedRules = deserialize(serializedRules);

        function evaluate(ruleSet: RuleSet, input: any) {
            const resultValues = ruleSet.evaluate(input);
            if (resultValues) {
                const outputMap: { [key: string]: any } = {};
                ruleSet.outputKeys.forEach((key, index) => {
                    outputMap[key] = resultValues[index];
                });
                return outputMap;
            }
            return null;
        }

        const input = {x: 20, y: 5, z: 10};
        const result = evaluate(deserializedRules, input);
        expect(result).toBeNull();
    });

    test('test read me', () => {

// Define example rules
        const rules = RuleSet.create(
            ['price', 'age', 'country'], // input column keys
            ['final-price', 'car', 'fruit'], // output column keys
            [
                rule(
                    [greaterThan(30), equalsTo(18), inList(['US', 'UK'])],  // predicates
                    [100, 'truck', 'Apple'] // output results
                ),
                rule(
                    [lessThan(30), equalsTo(10), inList(['TH', 'SG', 'AU'])],  // predicates
                    [(input) => add(min(-1, input['price']), 100), 'van', 'Mango'] // support built-in functions, can also compute results from input fields
                ),
                rule(
                    [greaterThan(30), lessThan(10), inList(['JP', 'KR'])],  // predicates
                    ['7', 'toyota', 'Orange']
                )
            ]
        );

// evaluate rules with the given input
        let input = {price: 40, age: 18, country: 'UK'};
        let result = rules.evaluate(input);
        expect(result).toEqual({"final-price": 100, "car": "truck", "fruit": "Apple"});

// Serialize rules
        const serializedRules = serializer(rules);

// Deserialize rules
        const deserializedRules = deserialize(serializedRules);

// Evaluate deserialized rules
        input = {price: 25, age: 10, country: 'TH'};
        result = deserializedRules.evaluate(input);
        expect(result).toEqual({"final-price": 99, "car": "van", "fruit": "Mango"});

    })
});
