import { User } from "./user.model";

export class Comment {
    public id: number;
    public author: User;
    public content: string;
    public postedAt: string;

    constructor(author, postedAt, content) {
        this.author = author;
        this.postedAt = postedAt;
        this.content = content;
    }

}