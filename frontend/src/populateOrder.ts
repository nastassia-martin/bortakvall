import { ICartItems, IOrder, IOrderInfo } from "./interfaces";

const calculateOrderTotal = (orderInfoList: IOrderInfo[]) => {
  // return orderTotal.
  // orderTotal s the quantity of each product * price + sum of each unique product
  let orderSum = 0;
  orderInfoList.forEach((foo) => {
    orderSum += foo.item_price * foo.qty;
  });
  return orderSum;
};

// gives informaton from each product the user has picked (amount, price and total sum).
export const populateOrder = (cartItems: ICartItems[]) => {
  let orderInfo: IOrderInfo[] = cartItems.map((item) => {
    return {
      product_id: item.id,
      qty: item.qty,
      item_price: item.item_price,
      item_total: item.item_total, // totala summan för hela mängden av en produkt
    };
  });

  //cartItems.filter(orderInfo[].item_price)
  let order: IOrder = {
    customer_first_name: "",
    customer_last_name: "",
    customer_address: "",
    customer_postcode: "",
    customer_city: "",
    customer_email: "",
    customer_phone: 0, 
    order_total: calculateOrderTotal(orderInfo), // summan för allt
    order_items: orderInfo,
  };
  return order;
};
