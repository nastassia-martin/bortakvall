import { IOrder } from "./interfaces";

// get information from URL localhost with all information from customer.
// ** FETCH orders ** från servern
export const fetchOrder = async () => {
  const res = await fetch('https://www.bortakvall.se/api/orders');

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return (await res.json()) as IOrder[];
};

// ** POST EN TODO TILL SERVERN **
export const postOrder = async (newOrder: IOrder) => {
  const res = await fetch('https://www.bortakvall.se/api/orders', {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json',
    },
    body: JSON.stringify(newOrder),
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return (await res.json()) as IOrder;
};