"use client";

import { useToast } from "@/hooks/use-toast";
import { Workspace } from "@/types/Workspace";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";

interface EditWorkspaceDialogProps {
    workspaceData: Workspace,
    refresh: () => void
}

export default function EditWorkspaceDialog({workspaceData, refresh}: EditWorkspaceDialogProps) {
    const { toast } = useToast();

    const [name, setName] = useState<string>(workspaceData.name);
    const [description, setDescription] = useState<string>(workspaceData.description || "");

    const [isOpen, setIsOpen] = useState<boolean>(false);

    async function onSave() {
        setIsOpen(false);
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/workspaces/" + workspaceData.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                description: description
            }),
            credentials: 'include',
        });
        if (!response.ok) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to update workspace',
            });
            return;
        }
        toast({
            title: 'Updating successfully',
            description: 'Workspace updated successfully',
        })
        refresh();
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="bg-transparent shadow-none hover:bg-gray-300 text-black py-2 px-2 rounded-full">
                    <Pencil className="h-4 w-4" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Edit Workspace Information</DialogTitle>
                    <DialogDescription>
                        Edit name and description of workspace
                    </DialogDescription>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="Workspace name"
                            className="col-span-3"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Description
                        </Label>
                        <Input
                            id="description"
                            placeholder="Optional"
                            className="col-span-3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>Close</Button>
                        <Button type="submit" disabled={(!name)} onClick={onSave}>Save</Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )

}