"use client";

/**
 * @author: @kokonutui (Modified for EchoRoom)
 * @description: A modern search bar component with action buttons and suggestions
 */

import { Search, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";

export interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  short?: string;
  end?: string;
  onClick?: () => void; 
}

interface SearchResult {
  actions: Action[];
}

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        height: { duration: 0.4 },
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  },
} as const;

function ActionSearchBar({
  actions = [],
  defaultOpen = false,
  placeholder = "Search ideas...",
  value = "",
  onChange,
}: {
  actions?: Action[];
  defaultOpen?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [query, setQuery] = useState(value);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isFocused, setIsFocused] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 200);

  // Keep internal query synced with parent value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filteredActions = useMemo(() => {
    if (!debouncedQuery) return actions;

    const normalizedQuery = debouncedQuery.toLowerCase().trim();
    return actions.filter((action) => {
      const searchableText = `${action.label} ${action.description || ""}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [debouncedQuery, actions]);

  useEffect(() => {
    if (!isFocused) {
      setResult(null);
      setActiveIndex(-1);
      return;
    }

    setResult({ actions: filteredActions });
    setActiveIndex(-1);
  }, [filteredActions, isFocused]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      if (onChange) onChange(e); // Trigger parent onChange
      setActiveIndex(-1);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!result?.actions.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < result.actions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : result.actions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && result.actions[activeIndex]) {
            handleActionClick(result.actions[activeIndex]);
          }
          break;
        case "Escape":
          setIsFocused(false);
          setActiveIndex(-1);
          break;
      }
    },
    [result?.actions, activeIndex]
  );

  const handleActionClick = useCallback((action: Action) => {
    if (action.onClick) {
      action.onClick(); // Execute the filter change
    }
    setIsFocused(false); // Close dropdown after selection
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setActiveIndex(-1);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocused(false);
      setActiveIndex(-1);
    }, 200);
  }, []);

  return (
    
    <div className="w-full relative">
      <div className="relative w-full z-10">
        <div className="relative flex items-center w-full">
         
          <Search className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
          
          <Input
            aria-activedescendant={
              activeIndex >= 0
                ? `action-${result?.actions[activeIndex]?.id}`
                : undefined
            }
            aria-autocomplete="list"
            aria-expanded={isFocused && !!result}
            autoComplete="off"
            // Adjusted classes to fit smoothly inside the Glassmorphic MagicCard
            className="w-full h-11 bg-transparent border-none rounded-xl py-2.5 pl-9 pr-10 text-base text-black dark:text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
            id="search"
            onBlur={handleBlur}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            role="combobox"
            type="text"
            value={query}
          />
          
          <div className="absolute top-1/2 right-1 h-4 w-4 -translate-y-1/2">
            <AnimatePresence mode="popLayout">
              {query.length > 0 ? (
                <motion.div
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  initial={{ y: -20, opacity: 0 }}
                  key="send"
                  transition={{ duration: 0.2 }}
                >
                  <Send className="h-4 w-4 text-blue-500" />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>

     
      <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50">
        <AnimatePresence>
          {isFocused && result && (
            <motion.div
              animate="show"
              aria-label="Search results"
              className="w-full overflow-hidden rounded-xl border border-white/10 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)]"
              exit="exit"
              initial="hidden"
              role="listbox"
              variants={ANIMATION_VARIANTS.container}
            >
              <div className="px-3 pt-3 pb-2 border-b border-gray-100 dark:border-white/5">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-slate-500">
                  Quick Actions
                </p>
              </div>
              <motion.ul role="none" className="p-2">
                {result.actions.map((action) => (
                  <motion.li
                    aria-selected={
                      activeIndex === result.actions.indexOf(action)
                    }
                    className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 transition-colors ${
                      activeIndex === result.actions.indexOf(action)
                        ? "bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-white"
                        : "hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-slate-300"
                    }`}
                    id={`action-${action.id}`}
                    key={action.id}
                    layout
                    onMouseDown={() => handleActionClick(action)} // Using onMouseDown so it fires before onBlur
                    role="option"
                    variants={ANIMATION_VARIANTS.item}
                  >
                    <div className="flex items-center gap-3">
                      <span aria-hidden="true" className="text-gray-400 dark:text-slate-400 shrink-0">
                        {action.icon}
                      </span>
                      <span className="font-medium text-sm">
                        {action.label}
                      </span>
                      {action.description && (
                        <span className="text-gray-400 text-xs ml-2">
                          {action.description}
                        </span>
                      )}
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ActionSearchBar;