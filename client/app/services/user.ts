export class User {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    city: string;
    tokens: string;
    admin: boolean;
    interests: string[];
    opinions: Opinion[];

  getFullName() {
    return this.firstName + ' ' + this.lastName;
  }
}

class Opinion {
  owner_nick :string;
  description :string;
  rank :string;
  category :string;
  created_at :string;
}

