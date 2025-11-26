export interface Unit {
    id: number;
    name: string;
    description: string;
    [key: string]: any;
}

export interface UnitLink {
    url: string | null;
    label: string;
    active: boolean;
}
