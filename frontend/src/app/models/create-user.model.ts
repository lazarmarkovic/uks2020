export class CreateUser {
  constructor(
    public username: string,
    public email: string,
    public password: string,
    public first_name: string,
    public last_name: string,
  ) {}
}
