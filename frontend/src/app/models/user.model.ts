export class User {
    constructor(
      public id: number,
      public username: string,
      public first_name: string,
      public last_name: string,
      public email: string,
      public is_active: boolean,
    ) {}
  }