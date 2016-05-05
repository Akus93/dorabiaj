export class Classified {
  _id: {
    $oid: string;
  };
  title: string;
  description: string;
  budget: string;
  province: string;
  city: string;
  category: string;
  begin_date: string;
  end_date: string;
  offers: string[];
  phone: string;
}
