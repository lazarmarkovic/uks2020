import { User } from "./user.model";

export class Repo {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public url: string,
        public is_private: boolean,
        public user: User,
    ) {}
}