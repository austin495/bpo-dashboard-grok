"use client";
import { useState, useEffect, useCallback } from "react";
import {
  File,
  Settings,
  User,
} from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Import for hidden accessibility title

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export function HeaderSearch() {
  const [open, setOpen] = useState(false);

  // 🔹 Handle Keyboard Shortcut (⌘K / Ctrl+K)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* 🔹 Search button UI */}
      <button
        onClick={() => setOpen(true)}
        className="w-[250px] flex items-center justify-between text-sm text-muted-foreground px-3 py-2 rounded-lg border focus:outline-none hover:bg-muted transition"
      >
        <span>Search...</span>
        <kbd className="ml-2 inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* 🔹 Search Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        {/* ✅ Visually Hidden Title for Accessibility */}
        <VisuallyHidden>
          <h2>Search Menu</h2>
        </VisuallyHidden>

        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* 🔹 Suggestions */}
          <CommandGroup heading="Links">
            <CommandItem onSelect={() => setOpen(false)}>
                <File />
                <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
                <File />
                <span>Submissions</span>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
                <File />
                <span>Live Chat</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* 🔹 Settings */}
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => setOpen(false)}>
              <User />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <Settings />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}