import { Category } from "./category";
import { ProductUnit } from "./product-unit";

export interface Product {
    id: number;
    barcode: string;
    sku: string;
    name: string;
    category: Category;
    product_units: ProductUnit[]
    price: number;
    [key: string]: any;
}

export interface ProductLink {
    url: string | null;
    label: string;
    active: boolean;
}
