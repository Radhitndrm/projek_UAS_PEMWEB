export interface Permission {
    id: number;
    name: string;
}

export interface PermissionLink {
    url: string | null;
    label: string;
    active: boolean;
}
