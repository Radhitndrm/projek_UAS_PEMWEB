import { ProductUnit } from "./product-unit";
import { Sale } from "./sale";

export interface SaleDetail {
    id: number;
    sale: Sale;
    product_unit: ProductUnit;
    quantity: number;
    price: number;
    [key: string]: any;
}

export interface SaleDetailLink {
    url: string | null;
    label: string;
    active: boolean;
}
