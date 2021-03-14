import { Milestone } from "./milestone.model";
import { User } from "./user.model";

export class Issue {
    public id: number;
    public title: string;
    public description: string;
    public due_date: string;
    public state: string;
    public weight: number;
    public milestone: Milestone;
    public assignees: User[];
    public type: string;


    static IssueWithId(title: string, description: string, due_date: string, state: string, weight: number, id: number, type: string, milestone?: Milestone, assignees?: User[]): Issue {
        let result = new Issue();
        result.title = title;
        result.description = description;
        result.weight = weight;
        result.due_date = due_date;
        result.state = state;
        result.id = id;
        result.type = type;
        result.milestone = milestone;
        result.assignees = assignees;
        return result;
    }

    static IssueWithoutId(title: string, description: string, due_date: string, state: string, type: string, weight: number, milestone?: Milestone, assignees?: User[]): Issue {
        var result = new Issue();
        result.title = title;
        result.description = description;
        result.weight = weight;
        result.due_date = due_date;
        result.state = state;
        result.type = type;
        result.milestone = milestone;
        result.assignees = assignees;
        return result;
    }
}