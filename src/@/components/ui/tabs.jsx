import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

const Tabs = ({ defaultValue, children, className, ...props }) => {
  return (
    <TabsPrimitive.Root
      defaultValue={defaultValue}
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </TabsPrimitive.Root>
  );
};

const TabsList = ({ className, ...props }) => {
  return (
    <TabsPrimitive.List
      className={cn(
        "h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid w-full grid-cols-2 mb-4",
        className
      )}
      {...props}
    />
  );
};

const TabsTrigger = ({ className, ...props }) => {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className
      )}
      {...props}
    />
  );
};

const TabsContent = ({ className, ...props }) => {
  return (
    <TabsPrimitive.Content
      className={cn("mt-2 rounded-md border border-border p-4", className)}
      {...props}
    />
  );
};

// Export components
export { Tabs, TabsList, TabsTrigger, TabsContent };
