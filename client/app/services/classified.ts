export class Classified {
  _id: {
    $oid: string;
  };
  title: string;
  owner_nick: string;
  description: string;
  budget: string;
  province: string;
  city: string;
  category: string;
  begin_date: string;
  end_date: string;
  phone: string;
  is_inappropriate: boolean;
  is_paid: boolean;
  offers: Offer[];
}

export class Offer {
  _id: {
    $oid: string;
  };
  owner_nick: string;
  price: number;
  is_accepted: boolean;
  created_at: string;
}
