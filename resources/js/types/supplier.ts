export interface Supplier {
    id: number;
    code: string;
    name: string;
    phone: string;
    address: string;
    [key: string]: any;
}

export interface SupplierLink {
    url: string | null;
    label: string;
    active: boolean;
}
