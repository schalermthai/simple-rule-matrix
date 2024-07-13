import {Predicate, predicates} from "../predicates";
import {OutputFunction, functions, Value} from "../functions";
import {Rule} from "../Rule";
import {RuleSet} from "../RuleSet";
import {FnValue} from "../functions/FnValue";

export class Deserializer {
    constructor(
        private knownPredicates: Record<string, (value: any) => Predicate>,
        private knownFunctions: Record<string, (...args: any[]) => OutputFunction>
    ) {}

    parseFnValue(serializedFunction: any): FnValue {
        const fn = (input: any) => this.knownFunctions[serializedFunction.func](
            ...serializedFunction.args.map((arg: any) => this.evaluateArg(arg, input))
        );
        return new FnValue(fn);
    }

    evaluateArg(arg: any, input: any): any {
        if (arg.func) {
            return this.parseFnValue(arg).evaluate(input);
        } else if (typeof arg === 'string' && arg.startsWith("input['")) {
            return input[arg.slice(7, -2)];
        }
        return arg;
    }

    parseResult(value: any) {
        return value.func ? this.parseFnValue(value) : new Value(value.value);
    }

    parsePredicate(serializedPredicate: any): Predicate {
        return this.knownPredicates[serializedPredicate.type](serializedPredicate.value);
    }

    parseRule(serializedRule: any): Rule {
        const predicates = serializedRule.predicates.map((pred: any) => this.parsePredicate(pred));
        const result = serializedRule.result.map((value: any) => this.parseResult(value));
        return new Rule(predicates, result);
    }

    parseRuleSet(serializedRuleSet: string): RuleSet {
        const { inputKeys, outputKeys, rules } = JSON.parse(serializedRuleSet);
        return RuleSet.create(inputKeys, outputKeys, rules.map((rule: any) => this.parseRule(rule)));
    }
}

export const deserialize = (serializedRuleSet: string) => new Deserializer(predicates, functions).parseRuleSet(serializedRuleSet);
