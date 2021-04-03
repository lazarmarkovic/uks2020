export class CreateComment {
    public author: string;
    public content: string;
    public postedAt: string;

    constructor(author, content, postedAt) {
        this.author = author;
        this.postedAt = postedAt;
        this.content = content;
    }

}