import { Supplier } from "./supplier";

export interface Order {
    id: number;
    order_code: string;
    supplier: Supplier;
    order_date: string;
    total_amount: number;
    status: string;
    [key: string]: any;
}

export interface OrderLink {
    url: string | null;
    label: string;
    active: boolean;
}
