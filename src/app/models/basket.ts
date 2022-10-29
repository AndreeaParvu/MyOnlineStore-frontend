import { Product } from "./product";

export interface BasketItem {
    id: number;
    product: Product;
    quantity: number;
}

export interface Basket {
    id: number;
    buyerId: number;
    items: BasketItem[];
}