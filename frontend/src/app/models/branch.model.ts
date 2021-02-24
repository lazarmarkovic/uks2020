import { Commit } from "./commit.model";
import { Repo } from "./repo.model";
import { User } from "./user.model";

export class Branch {
    constructor(
        private id: number,
        private name: string,
        private creator: User,
        private repo: Repo,
        private last_commit: Commit,
    ){}
}