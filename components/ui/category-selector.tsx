"use client"

import { Category } from "@/sanity.types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from '@/components/ui/button'; 
import { Check, ChevronsUpDown } from "lucide-react"; 
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandInput, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CategorySelectorProps {
    categories: Category[];
}

export function CategorySelector({ categories }: CategorySelectorProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string>("");
    const router = useRouter();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button 
                    variant="outline" 
                    role="combobox" 
                    aria-expanded={open} 
                    aria-label="Select a category"
                    className="w-full max-w-xs relative flex justify-between items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                    {value ? categories.find((category) => category._id === value)?.title : "Filter by category"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full max-w-xs p-2 mt-2 rounded-lg shadow-lg bg-white">
                <Command>
                    <CommandInput 
                        placeholder="Search categories..." 
                        className="h-10 px-4 py-2 border border-gray-300 rounded-lg w-full mb-2"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const selectedCategory = categories.find((c) => 
                                    c.title?.toLowerCase().includes(e.currentTarget.value.toLowerCase())
                                );
                                if (selectedCategory && selectedCategory.slug?.current) {
                                    setValue(selectedCategory._id);
                                    router.push(`/categories/${selectedCategory.slug.current}`);
                                    setOpen(false);
                                }
                            }
                        }}
                    />
                    <CommandList className="overflow-y-auto max-h-60">
                        <CommandEmpty>No categories found.</CommandEmpty>
                        <CommandGroup>
                            {categories.map((category) => (
                                <CommandItem 
                                    key={category._id} 
                                    value={category._id} 
                                    onSelect={() => {
                                        setValue(value === category._id ? "" : category._id);
                                        setOpen(false);
                                        router.push(`/categories/${category.slug?.current}`);
                                    }}
                                    className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                                >
                                    {category.title}
                                    <Check className={cn("ml-auto h-4 w-4", value === category._id ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
