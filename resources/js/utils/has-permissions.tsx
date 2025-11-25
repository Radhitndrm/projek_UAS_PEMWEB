
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";

export default function hasAnyPermission(requiredPermissions: string[]): boolean {
    const { auth } = usePage<PageProps>().props;

    if (auth.super) {
        return true;
    }

    // Check if any permission in auth.permissions ends with the required suffix
    return requiredPermissions.some(permission => {
        if (permission.startsWith('*-')) {
            const suffix = permission.slice(1);
            return Object.keys(auth.permissions).some(
                userPermission => userPermission.endsWith(suffix) && auth.permissions[userPermission]
            );
        }
        return auth.permissions[permission] === true;
    });
}

