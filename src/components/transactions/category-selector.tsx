"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Category {
  value: string;
  label: string;
}

const predefinedCategories: Category[] = [
  { value: "food", label: "Food & Dining" },
  { value: "transport", label: "Transportation" },
  { value: "housing", label: "Housing" },
  { value: "utilities", label: "Utilities" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "shopping", label: "Shopping" },
  { value: "income", label: "Income" },
  { value: "other", label: "Other" },
];

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  transactionType?: 'income' | 'expense';
}

export function CategorySelector({ value, onChange, transactionType }: CategorySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>(predefinedCategories);
  const [customCategoryOpen, setCustomCategoryOpen] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState("");

  const handleAddCustomCategory = () => {
    if (newCategoryName.trim() === "") return;
    const newCategoryValue = newCategoryName.toLowerCase().replace(/\s+/g, "-");
    const newCategory: Category = { value: newCategoryValue, label: newCategoryName };
    setCategories([...categories, newCategory]);
    onChange(newCategoryValue); // Select the new category
    setNewCategoryName("");
    setCustomCategoryOpen(false);
    setOpen(false); // Close popover after adding
  };

  // Filter categories based on transaction type if provided
  const filteredCategories = React.useMemo(() => {
    if (!transactionType) return categories;
    if (transactionType === 'income') {
      return categories.filter(cat => cat.value === 'income' || !predefinedCategories.find(pc => pc.value === cat.value && pc.value !== 'income'));
    }
    // For expense, exclude 'income' unless it's a custom category that happens to be named 'income'
    return categories.filter(cat => cat.value !== 'income' || !predefinedCategories.find(pc => pc.value === cat.value && pc.value === 'income'));
  }, [categories, transactionType]);


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background"
        >
          {value
            ? filteredCategories.find((category) => category.value === value)?.label
            : "Select category..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {filteredCategories.map((category) => (
                <CommandItem
                  key={category.value}
                  value={category.label} // Use label for search/display in command
                  onSelect={() => {
                    onChange(category.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <Dialog open={customCategoryOpen} onOpenChange={setCustomCategoryOpen}>
                <DialogTrigger asChild>
                   <CommandItem
                    onSelect={(e) => {
                      e.preventDefault(); // Prevent Command's default onSelect behavior
                      setCustomCategoryOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Custom Category
                  </CommandItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Custom Category</DialogTitle>
                    <DialogDescription>
                      Create a new category for your transactions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="col-span-3 bg-background"
                        placeholder="e.g., Gifts"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCustomCategoryOpen(false)}>Cancel</Button>
                    <Button type="button" onClick={handleAddCustomCategory} className="bg-primary hover:bg-primary/90">Add Category</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
