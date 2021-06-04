export class Commit {
    constructor(
        public id: number,
        public message: string,
        public hash: string,
        public timestamp: string,
        public author_name: string,
        public author_email: string,

    ) {}
}