export class Milestone {
    public id: number;
    public name: string;
    public description: string;
    public start_date: string;
    public end_date: string;
    public state: string;

    static MilestoneWithId(name: string, description: string, start_date: string, end_date: string, state: string, id: number): Milestone {
        let result = new Milestone();
        result.name = name;
        result.description = description;
        result.start_date = start_date;
        result.end_date = end_date;
        result.state = state;
        result.id = id;
        return result;
    }

    static MilestoneWithoutId(name: string, description: string, start_date: string, end_date: string, state: string): Milestone {
        var result = new Milestone();
        result.name = name;
        result.description = description;
        result.start_date = start_date;
        result.end_date = end_date;
        result.state = state;
        return result;
    }
}