"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  Drawer,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectMember } from "@/db/schema";
import { useIsMobile } from "@/hooks/use-mobile";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useActionState, useEffect, useState } from "react";
import { deleteMember } from "../actions/delete-member";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createMember } from "../actions/create-member";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export function TableCellViewer({
  variant,
  ...member
}: { variant: "create" | "edit" | "delete" } & SelectMember) {
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isChecked, setIsCheck] = useState(false);

  const [deleteMemberState, deleteMemberAction, deleteMemberIsPending] =
    useActionState(deleteMember, null);

  const [createMemberState, createMemberAction, createMemberIsPending] =
    useActionState(createMember, null);

  const formAction = (formData: FormData) => {
    if (variant === "create") {
      createMemberAction(formData);
    } else if (variant === "delete") {
      formData.set("id", member.id); //value didn't get passed when input disabled
      deleteMemberAction(formData);
    }
  };

  useEffect(() => {
    if (createMemberState) {
      if (createMemberState.status === "success") {
        setIsDrawerOpen(false);
        toast.success("A new member was successfully created.");
      } else if (createMemberState.status === "error") {
        toast.error(createMemberState.message);
      }
    }
  }, [createMemberState]);

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
    >
      {variant === "create" ? (
        <DrawerTrigger asChild>
          <Button variant="outline">
            <IconPlus />
            <span>Create a member</span>
          </Button>
        </DrawerTrigger>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="text-muted-foreground flex size-8"
                size="icon"
              >
                {variant === "edit" && <IconEdit />}
                {variant === "delete" && <IconTrash />}
              </Button>
            </DrawerTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {variant === "edit" && "Edit member's profile"}
              {variant === "delete" && "Delete a member"}
            </p>
          </TooltipContent>
        </Tooltip>
      )}
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>
            {variant === "create" && "Create a member"}
            {variant === "edit" && "Edit member's profile"}
            {variant === "delete" && "Delete a member"}
          </DrawerTitle>
          <DrawerDescription>
            {variant === "create" &&
              "Fill in the following form to create a member."}
            {variant === "edit" &&
              "Make some changes to member's attribute(s)."}
            {variant === "delete" &&
              "You are about to delete a member from the list."}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form
            id="form-drawer"
            className="flex flex-col gap-4"
            action={formAction}
          >
            {variant !== "create" && (
              <div className="flex flex-col gap-3">
                <Label htmlFor="id">ID</Label>
                <Input name="id" defaultValue={member.id} disabled />
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Name</Label>
              <Input name="name" defaultValue={member.name} required />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="email">Email</Label>
              <Input name="email" defaultValue={member.email} required />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="phone">Phone</Label>
              <Input name="phone" defaultValue={member.phone} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="country">Country</Label>
                <Input name="country" defaultValue={member.country || ""} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="city">City</Label>
                <Input name="city" defaultValue={member.city || ""} />
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          {variant === "create" && (
            <Button
              form="form-drawer"
              type="submit"
              disabled={createMemberIsPending}
            >
              {createMemberIsPending && (
                <Loader2Icon className="animate-spin" />
              )}
              Create
            </Button>
          )}
          {variant === "edit" && <Button type="submit">Save Changes</Button>}
          {variant === "delete" && (
            <>
              <div className="w-full flex items-center justify-center gap-3">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => setIsCheck(!isChecked)}
                />
                <Label>Yes, delete this member from the list.</Label>
              </div>
              <Button
                variant={"destructive"}
                disabled={!isChecked || deleteMemberIsPending}
                form="form-drawer"
                type="submit"
              >
                {deleteMemberIsPending && (
                  <Loader2Icon className="animate-spin" />
                )}
                Delete
              </Button>
            </>
          )}
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
