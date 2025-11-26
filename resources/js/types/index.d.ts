import { Config } from 'ziggy-js';
import { Role } from './role';

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    email_verified_at?: string;
    avatar?: string;
    roles: Role[];
}

export interface UserLink {
    url: string | null;
    label: string;
    active: boolean;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        permissions: Record<string, boolean>;
        super: boolean;
    };
    ziggy: Config & { location: string };
};
