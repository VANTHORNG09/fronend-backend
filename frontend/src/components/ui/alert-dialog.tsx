"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogContent = ({ className, ...props }: AlertDialogPrimitive.AlertDialogContentProps) => (
  <AlertDialogPrimitive.Portal>
    <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/45" />
    <AlertDialogPrimitive.Content className={cn("fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-card p-6 shadow-lg", className)} {...props} />
  </AlertDialogPrimitive.Portal>
);
export const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("mb-4", className)} {...props} />;
export const AlertDialogTitle = AlertDialogPrimitive.Title;
export const AlertDialogDescription = AlertDialogPrimitive.Description;
export const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("flex justify-end gap-2", className)} {...props} />;
export const AlertDialogCancel = (props: AlertDialogPrimitive.AlertDialogCancelProps) => <AlertDialogPrimitive.Cancel asChild><Button variant="outline" {...props} /></AlertDialogPrimitive.Cancel>;
export const AlertDialogAction = (props: AlertDialogPrimitive.AlertDialogActionProps) => <AlertDialogPrimitive.Action asChild><Button variant="destructive" {...props} /></AlertDialogPrimitive.Action>;

