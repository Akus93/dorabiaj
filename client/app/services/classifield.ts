export class Classifield {
  title: string;
  owner_nick: string;
  description: string;
  budget: number;
  provinc: string;
  city: string;
  category: string;
  begin_date :string;
  end_date :string;
  offers: Offer[];
  phone: string;
  created_at: string;
}

export class Offer {
  owner_nick:string;
  price:number;
  is_accepted:boolean;
  created_at:string
}
