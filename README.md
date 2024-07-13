# SimpleRuleMatrix

**SimpleRuleMatrix** is a simple and efficient rule engine designed to serialize and deserialize content into JSON
files. With RuleMatrix, you can easily define and manage rules, making it a powerful tool for various applications
requiring dynamic decision-making and logic handling.

## Features

- **Easy Serialization and Deserialization**: Convert rules and conditions to and from JSON with ease.
- **Simple API**: Intuitive and straightforward API to define and evaluate rules.
- **Extensible**: Easily add custom predicates and built-in functions to extend the engine's capabilities.
- **Lightweight**: Minimal dependencies.
- **Readable JSON Output**: Clear and structured JSON format for serialized content.

## Usage

```typescript
import {RuleSet} from "../engine";
import {equalsTo, greaterThan, inList, lessThan} from "../engine/predicates";
import {add, min, value} from "../engine/functions";
import {deserialize, serializer} from "../engine/marshaller";
import {rule} from "../engine/Rule";

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

// Serialize rules to JSON
const serializedRules = serializer(rules); 
// {"inputKeys":["price","age","country"],"outputKeys":["final-price","car","fruit"],"rules":[{"predicates":[{"type":"greaterThan","value":30},{"type":"equalsTo","value":18},{"type":"inList","value":["US","UK"]}],"result":[{"value":100},{"value":"truck"},{"value":"Apple"}]},{"predicates":[{"type":"lessThan","value":30},{"type":"equalsTo","value":10},{"type":"inList","value":["TH","SG","AU"]}],"result":[{"func":"add","args":[{"func":"min","args":[-1,"input['price']"]},100]},{"value":"van"},{"value":"Mango"}]},{"predicates":[{"type":"greaterThan","value":30},{"type":"lessThan","value":10},{"type":"inList","value":["JP","KR"]}],"result":[{"value":"7"},{"value":"toyota"},{"value":"Orange"}]}]}

// Deserialize rules
const deserializedRules = deserialize(serializedRules);

// Evaluate deserialized rules
input = {price: 25, age: 10, country: 'TH'};
result = deserializedRules.evaluate(input);
expect(result).toEqual({"final-price": 99, "car": "van", "fruit": "Mango"});

