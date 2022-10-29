export interface Product {
    id: number;
    name: string;
    description:string;
    price: number;
    pictureUrl: string;
    type?: string; //proprietati optionale
    brand: string;
    quantityInStock: number;
}