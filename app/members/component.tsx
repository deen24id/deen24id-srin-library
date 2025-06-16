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
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useActionState, useState } from "react";
import { deleteMember } from "../actions/delete-member";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TableCellViewer({
  variant,
  ...member
}: { variant: "edit" | "delete" } & SelectMember) {
  const isMobile = useIsMobile();

  const [isChecked, setIsCheck] = useState(false);

  const [state, deleteMemberAction] = useActionState(deleteMember, null);

  const formAction = (formData: FormData) => {
    formData.set("id", member.id); //value didn't get passed when input disabled
    if (variant === "delete") {
      deleteMemberAction(formData);
    }
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
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
            {variant === "edit" && "Edit Member's Profile"}
            {variant === "delete" && "Delete a member"}
          </p>
        </TooltipContent>
      </Tooltip>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          {variant === "edit" && <IconEdit />}
          {variant === "delete" && <IconTrash />}
          <DrawerTitle>
            {variant === "edit" && "Edit Member's Profile"}
            {variant === "delete" && "Delete a member"}
          </DrawerTitle>
          <DrawerDescription>
            {variant === "edit" &&
              "Make some changes in the form input(s) to edit the following member's profile. Click save changes to finalize the edit."}
            {variant === "delete" &&
              "You are about to delete a member from the list. Please double check on the member's profile before making the deletion."}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form
            id="form-drawer"
            className="flex flex-col gap-4"
            action={formAction}
          >
            <div className="flex flex-col gap-3">
              <Label htmlFor="id">ID</Label>
              <Input name="id" defaultValue={member.id} disabled />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Name</Label>
              <Input name="name" defaultValue={member.name} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="email">Email</Label>
              <Input name="email" defaultValue={member.email} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="phone">Phone</Label>
              <Input name="phone" defaultValue={member.phone} />
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
                disabled={!isChecked}
                form="form-drawer"
                type="submit"
              >
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
