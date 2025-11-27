import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { Trash, X } from "lucide-react";

interface modalDeleteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    url: string;
}

export function ModalDelete({ open, onOpenChange, url }: modalDeleteProps) {

    const {delete : destroy} = useForm();

    const { toast } = useToast()

    const deleteData = async (url: string) => {
        destroy(url, {
            onSuccess: () => {
                onOpenChange(false);
                toast({
                    variant: 'default',
                    title: "Success",
                    description: "Data berhasil dihapus.",
                })
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Konfirmasi Hapus</DialogTitle>
                    <DialogDescription>
                        Apakah anda yakin ingin menghapus data ini?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center md:justify-start items-center gap-2 mt-2">
                    <DialogClose asChild>
                        <Button variant="danger">
                            <X/> Batal
                        </Button>
                    </DialogClose>
                    <Button type="button" variant="default" onClick={() => deleteData(url)}>
                        <Trash/> Hapus
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}