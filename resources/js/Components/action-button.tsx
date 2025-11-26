import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Edit, Trash, CircleArrowRight } from "lucide-react";
import { Link } from "@inertiajs/react";
import hasAnyPermission from '@/utils/has-permissions'

interface ActionButtonProps {
    isModal?: boolean;
    withEdit?: boolean;
    withDetail?: boolean;
    withDelete?: boolean;
    actionEdit?: () => void;
    actionDelete?: () => void;
    actionEditHref?: string;
    actionDetailHref?: string;
    permissionPrefix: string;
    children?: React.ReactNode
}

export function ActionButton({
    withDetail = false,
    withEdit = true,
    withDelete = true,
    isModal = false,
    actionEdit,
    actionDetailHref = '',
    actionEditHref = '',
    actionDelete,
    permissionPrefix,
    children
}: ActionButtonProps) {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus-within:outline-none">
                <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left" align="start">
                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {children}
                {withDetail && hasAnyPermission([`${permissionPrefix}-show`]) && (
                    <DropdownMenuItem asChild>
                        <Link href={actionDetailHref}>
                            <CircleArrowRight /> Detail
                        </Link>
                    </DropdownMenuItem>
                )}

                {isModal ? (
                        withEdit && hasAnyPermission([`${permissionPrefix}-update`]) && (
                            <DropdownMenuItem onClick={actionEdit}>
                                <Edit /> Ubah
                            </DropdownMenuItem>
                        )
                    ) : (
                        withEdit && hasAnyPermission([`${permissionPrefix}-update`]) && (
                            <DropdownMenuItem asChild>
                                <Link href={actionEditHref}>
                                    <Edit /> Ubah
                                </Link>
                            </DropdownMenuItem>
                        )
                    )
                }

                {withDelete &&
                    hasAnyPermission([`${permissionPrefix}-delete`]) && (
                        <DropdownMenuItem onClick={actionDelete}>
                            <Trash /> Hapus
                        </DropdownMenuItem>
                    )
                }
            </DropdownMenuContent>
        </DropdownMenu>
    );
}