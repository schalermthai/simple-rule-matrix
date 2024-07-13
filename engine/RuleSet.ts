import {Rule} from "./Rule";
import {Value} from "./functions";

export class RuleSet {
    private constructor(public inputKeys: string[], public outputKeys: string[], public rules: Rule[]) {
    }

    evaluate(input: Record<string, any>): Record<string, any> | null {
        for (let rule of this.rules) {
            if (rule.evaluate(input, this.inputKeys)) {
                const output = rule.result.map(r => r.evaluate(input));
                return this.mapOutput(output);
            }
        }
        return null;
    }

    serialize(): string {
        return JSON.stringify({
            inputKeys: this.inputKeys,
            outputKeys: this.outputKeys,
            rules: this.rules.map(rule => rule.serialize())
        });
    }

    private mapOutput(resultValues: Value[]): Record<string, any> | null {
        const outputMap: Record<string, any> = {};
        this.outputKeys.forEach((key, index) => outputMap[key] = resultValues[index].getValue());
        return outputMap;
    }

    static create(inputKeys: string[], outputKeys: string[], rules: Rule[] = []): RuleSet {
        if (inputKeys.length === 0) {
            throw new Error("Input keys must not be empty");
        }

        if (outputKeys.length === 0) {
            throw new Error("Output keys must not be empty");
        }

        if (rules.length === 0) {
            throw new Error("Rules must not be empty");
        }

        const inputLength = inputKeys.length;
        if (!rules.every(rule => rule.predicates.length === inputLength)) {
            throw new Error("All rules must have the same number of predicates as the input keys");
        }

        return new RuleSet(inputKeys, outputKeys, rules);
    }
}

