import * as React from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DateRange {
    from: string;
    to: string;
}

interface DateRangePickerProps {
    className?: string;
    date: DateRange;
    setDate: (newDate: DateRange) => void;
    label: string;
}

export function DateRangePicker({ className, date, setDate, label }: DateRangePickerProps) {
    const handleDateChange = (selectedRange: { from?: Date; to?: Date } | undefined) => {
        if (selectedRange) {
            const formattedDate: DateRange = {
                from: selectedRange.from ? format(selectedRange.from, "yyyy-MM-dd") : '',
                to: selectedRange.to ? format(selectedRange.to, "yyyy-MM-dd") : '',
            };
            setDate(formattedDate);
        }
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        size="input"
                        className={cn(
                            "w-full justify-start text-left font-normal dark:bg-gray-900 dark:hover:bg-gray-900 focus:ring-1 focus:ring-indigo-500",
                            !date.from && "dark:text-gray-400"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date.from ? (
                            date.to ? (
                                <>
                                    {format(parseISO(date.from), "LLL dd, y")} -{" "}
                                    {format(parseISO(date.to), "LLL dd, y")}
                                </>
                            ) : (
                                format(parseISO(date.from), "LLL dd, y")
                            )
                        ) : (
                            <span>{label}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date.from ? parseISO(date.from) : undefined}
                        selected={{
                            from: date.from ? parseISO(date.from) : undefined,
                            to: date.to ? parseISO(date.to) : undefined,
                        }}
                        onSelect={handleDateChange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}