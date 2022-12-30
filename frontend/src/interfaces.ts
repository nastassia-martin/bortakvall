// export to API.ts and main.ts
export interface IProduct {
  id: number;
  name: string;
  description: string | number;
  price: number;
  images: {
    thumbnail: string;
    large: string;
  };
  stock_status: string | boolean;
  stock_quantity: number | boolean | string;
}

export interface IResult {
  status: string;
  data: IProduct[];
}
export interface IOrderInfo {
  product_id: number;
  qty: number;
  item_price: number;
  item_total: number;
}

export interface IOrder {
  customer_first_name: string;
  customer_last_name: string;
  customer_address: string | number;
  customer_postcode: number;
  customer_city: string;
  customer_email: string | number;
  order_total: number;
  order_items: IOrderInfo[];
}

export interface ICartItems {
  id: number;
  name: string;
  image: string;
  qty: number;
  item_price: number;
  item_total: number;
}
