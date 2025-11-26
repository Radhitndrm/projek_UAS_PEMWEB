import { Product } from "./product";
import { Unit } from "./unit";

export interface ProductUnit {
    id: number;
    name: string;
    product: Product;
    barcode: string;
    unit: Unit;
    quantity: number;
    price: number;
    [key: string]: any;
}

export interface ProductUnitLink {
    url: string | null;
    label: string;
    active: boolean;
}
