import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps {
    options: { id: string; name: string }[];
    placeholder: string;
    value: string;
    setValue: (value: string) => void;
    withChain?: (value: string) => void;
    message?: string;
    disabled?: boolean;
}

export function Combobox({
    options,
    placeholder,
    value,
    setValue,
    withChain,
    message = 'produk',
    disabled = false,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    size="input"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between dark:bg-gray-900 dark:hover:bg-gray-900"
                    disabled={disabled}
                >
                    {value
                        ? options.find((option) => option.id === value)?.name
                        : placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 min-w-full">
                <Command>
                    <CommandInput
                        placeholder={`Cari data ${message}`}
                        className="h-9 px-3 py-2 border-0 focus:ring-0 w-full"
                    />
                    <CommandList>
                        <CommandEmpty>{message} tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    onSelect={() => {
                                        setValue(option.id);
                                        if (withChain) {
                                            withChain(option.id);
                                        }
                                        setOpen(false);
                                    }}
                                >
                                    {option.name}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === option.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}