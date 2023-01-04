import { ICartItems, IOrder, IOrderInfo } from "./interfaces";

//------function that multiplies quantity and price of each product that the client has more than one of. 
const calculateOrderTotal = (orderInfoList: IOrderInfo[]) => {
  let orderSum = 0
  orderInfoList.forEach((foo) => {
    orderSum += foo.item_price * foo.qty
  })
  return orderSum;
}

// gives informaton from each product the user has picked (amount, price and total sum).
export const populateOrder = (cartItems: ICartItems[]) => {
  let orderInfo: IOrderInfo[] = cartItems.map((item) => {
    return {
      product_id: item.id,
      qty: item.qty,
      item_price: item.item_price,
      item_total: item.item_total,
    }
  })

  // ---gives the values om the total price for all products and quantity to render out for the orderinformation in kassa. 
  let order: IOrder = {
    customer_first_name: "",
    customer_last_name: "",
    customer_address: "",
    customer_postcode: "",
    customer_city: "",
    customer_email: "",
    customer_phone: "",
    order_total: calculateOrderTotal(orderInfo),
    order_items: orderInfo,
  }
  return order;
}
