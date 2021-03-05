import { Repo } from "./repo.model";

export class Milestone {
    public id: number;
    public name: string;
    public description: string;
    public start_date: Date;
    public end_date: Date;
    public state: string;

    constructor(id: number, name: string, description: string, start_date: Date, end_date: Date, state: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.start_date = start_date;
        this.end_date = end_date;
        this.state = state;
    }

}