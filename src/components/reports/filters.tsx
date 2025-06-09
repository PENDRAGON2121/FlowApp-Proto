
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FilterIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const predefinedCategories = [
  { value: "all", label: "All Categories" },
  { value: "food", label: "Food & Dining" },
  { value: "transport", label: "Transportation" },
  { value: "housing", label: "Housing" },
  { value: "utilities", label: "Utilities" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "shopping", label: "Shopping" },
  { value: "other", label: "Other" },
];

export interface ReportFilterValues {
  dateRange: DateRange;
  category: string;
  transactionType: string;
}

interface ReportFiltersProps {
  onFilterChange: (filters: ReportFilterValues) => void;
  initialFilters?: Partial<ReportFilterValues>;
}

export function ReportFilters({ onFilterChange, initialFilters }: ReportFiltersProps) {
  const defaultDateRange: DateRange = {
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  };

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(initialFilters?.dateRange || defaultDateRange);
  const [category, setCategory] = React.useState<string>(initialFilters?.category || "all");
  const [transactionType, setTransactionType] = React.useState<string>(initialFilters?.transactionType || "all");

  const handleApplyFilters = () => {
    if (dateRange) {
      onFilterChange({ dateRange, category, transactionType });
    }
  };
  
  React.useEffect(() => {
    // Apply filters automatically when a filter value changes.
    // This could be changed to require a button click if preferred.
    if (dateRange) {
      onFilterChange({ dateRange, category, transactionType });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, category, transactionType]); // onFilterChange is a dependency we know won't change frequently in this context

  return (
    <Card className="p-4 sm:p-6 shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <Label htmlFor="date-range" className="text-sm font-medium mb-1 block">Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-range"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal bg-background",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="category-filter" className="text-sm font-medium mb-1 block">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category-filter" className="w-full bg-background">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {predefinedCategories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="type-filter" className="text-sm font-medium mb-1 block">Type</Label>
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger id="type-filter" className="w-full bg-background">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleApplyFilters} className="w-full lg:w-auto bg-primary hover:bg-primary/90">
          <FilterIcon className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
      </div>
    </Card>
  );
}
