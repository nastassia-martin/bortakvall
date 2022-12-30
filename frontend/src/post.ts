import { IOrder } from "./interfaces";

// get information from URL localhost with all information from customer.
// ** FETCH todos ** från servern
export const fetchOrder = async () => {
  const res = await fetch(/*URL with order*/);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return (await res.json()) as IOrder[];
};

// ** POST EN TODO TILL SERVERN **
export const postOrder = async (order: IOrder) => {
  const res = await fetch("order from localhost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return (await res.json()) as IOrder;
};
