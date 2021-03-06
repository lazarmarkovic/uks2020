import { Milestone } from "./milestone.model";

export class Issue {
    public id: number;
    public title: string;
    public description: string;
    public due_date: string;
    public state: string;
    public weight: number;
    public milestone: Milestone;


    static IssueWithId(name: string, description: string, due_date: string, state: string, weight: number, id: number, milestone?: Milestone): Issue {
        let result = new Issue();
        result.title = name;
        result.description = description;
        result.weight = weight;
        result.due_date = due_date;
        result.state = state;
        result.id = id;
        result.milestone = milestone;
        return result;
    }

    static IssueWithoutId(name: string, description: string, due_date: string, state: string, weight: number): Issue {
        var result = new Issue();
        result.title = name;
        result.description = description;
        result.weight = weight;
        result.due_date = due_date;
        result.state = state;
        return result;
    }
}