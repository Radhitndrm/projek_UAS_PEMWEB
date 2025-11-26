import { Permission } from "./permission";

export interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

export interface RoleLink {
    url: string | null;
    label: string;
    active: boolean;
}
