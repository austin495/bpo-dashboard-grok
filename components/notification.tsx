import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";

export function Notification() {

  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full py-[3px] px-[8px]">
                <Bell className="size-4" />
            </Button>
        </PopoverTrigger>
        <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}