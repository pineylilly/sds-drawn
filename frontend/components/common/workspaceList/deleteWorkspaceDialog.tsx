"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";
import { useState } from "react";

interface DeleteWorkspceDialogProps {
    workspaceId: string;
    refresh: () => void;
}

export default function DeleteWorkspceDialog({workspaceId, refresh}: DeleteWorkspceDialogProps) {
    const { toast } = useToast();

    const [isOpen, setIsOpen] = useState<boolean>(false);

    async function onDelete() {
        setIsOpen(false);
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/workspaces/" + workspaceId, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to delete workspace',
            });
            return;
        }
        toast({
            title: 'Deleting successfully',
            description: 'Workspace deleted successfully',
        })
        refresh();
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="bg-transparent shadow-none hover:bg-gray-300 text-black py-2 px-2 rounded-full">
                    <Trash className="h-4 w-4" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Delete Workspace</DialogTitle>
                    <div className="w-full">
                        <Label htmlFor="name" className="text-right">
                            Are you sure to delete this workspace?
                        </Label>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>No</Button>
                        <Button variant="destructive" type="submit" onClick={onDelete}>Yes</Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}