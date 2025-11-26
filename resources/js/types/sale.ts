import { SaleDetail } from "./sale-detail";
export interface Sale {
    id: number;
    sale_code: string;
    customer: string;
    sale_date: string;
    total_amount: number;
    payment_method: string;
    sale_details: SaleDetail[];
    [key: string]: any;
}

export interface SaleLink {
    url: string | null;
    label: string;
    active: boolean;
}
