// src/components/DishSelector.tsx
'use client';

import * as React from "react";
// import { Check, ChevronsUpDown } from "lucide-react";
import { ChevronsUpDown } from "lucide-react"; // 修改后: 移除了 Check
// import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Dish {
  id: string;
  name: string;
}

interface DishSelectorProps {
  dishes: Dish[];
  onSelect: (dish: Dish) => void;
}

export function DishSelector({ dishes, onSelect }: DishSelectorProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className="w-[150px] justify-between"
        >
          ＋ 添加菜品
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="搜索菜品..." />
          <CommandEmpty>没找到这道菜。</CommandEmpty>
          <CommandGroup>
            {dishes.map((dish) => (
              <CommandItem
                key={dish.id}
                value={dish.name}
                onSelect={() => {
                  onSelect(dish);
                  setOpen(false);
                }}
              >
                {dish.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}