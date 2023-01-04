//-----INTERFACE FOR INFORMATION FOR THE PRODUCT
export interface IProduct {
    id: number,
    name: string,
    description: string | number,
    price: number,
    images: {
        thumbnail: string,
        large: string,
    },
    stock_status: string | boolean,
    stock_quantity: number
}
//----INTERFACE FOR INFORMATION ON THE RESPONS OF THE FETCH OF PRODUCTS
export interface IResult {
    status: string,
    data: IProduct[]
}
//--------INTERFACE FOR CLIENTS ORDER FOR EACH PRODUCT
export interface IOrderInfo {
    id?: number,
    order_id?: number,
    product_id: number,
    qty: number,
    item_price: number,
    item_total: number,
}
//---INTERFACE FOR TOTAL ORDER AND CLIENTS ORDERINFORMATION 
export interface IOrder {
    customer_first_name: string,
    customer_last_name: string,
    customer_address: string | number,
    customer_postcode: string,
    customer_city: string,
    customer_email: string | number,
    customer_phone?: string,
    order_total: number,
    order_items: IOrderInfo[]
}
//---INTERFACE FOR WHAT CLIENT HAS IN HIS / HER BASKET. 
export interface ICartItems {
    id: number,
    name: string,
    image: string,
    qty: number,
    item_price: number,
    item_total: number,
}
// ---- RESPONS AFTER ORDER: ORDER ID, CLIENTS ORDERINFORMATION
export interface IConfirmation {
    id: number,
    order_date: string,
    customer_first_name: string,
    customer_last_name: string,
    customer_address: string,
    customer_postcode: string,
    customer_city: string,
    customer_email: string | number,
    customer_phone?: string,
    order_total: number,
    created_at: string,
    updated_at: string,
    items: IOrderInfo[]
}
//----INTERFACE FOR INFORMATION ON THE RESPONS OF THE POST OF ORDERINFORMATION 
export interface IConfirmationResult {
    status: string,
    data: IConfirmation,
    message: string
}
