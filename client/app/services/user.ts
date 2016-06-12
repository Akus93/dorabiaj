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
    ranks: Rank[];

  getFullName() {
    return this.firstName + ' ' + this.lastName;
  }
}

export class Rank {
  category:string;
  points:number;
}

export class Opinion {
  owner_nick :string;
  description :string;
  rank :string;
  category :string;
  created_at :string;
}

