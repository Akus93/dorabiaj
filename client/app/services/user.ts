export class User {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    city: string;
    tokens: string;
    admin: boolean;


  getFullName() {
    return this.firstName + ' ' + this.lastName;
  }

}
