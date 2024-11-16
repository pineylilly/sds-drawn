"use client";

import { Button } from "@/components/ui/button";
import { ChatBubbleAction } from "@/components/ui/chat/chat-bubble";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

interface DeleteMessageDialogProps {
    messageId: string;
    refresh: () => void;
}

export default function DeleteMessageDialog({messageId, refresh}: DeleteMessageDialogProps) {
    const params = useParams<{ id: string }>()
    const { toast } = useToast();

    const [isOpen, setIsOpen] = useState<boolean>(false);

    async function onDelete() {
        setIsOpen(false);
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/chat/" + params.id + "/messages/" + messageId, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to delete message',
            });
            return;
        }
        toast({
            title: 'Deleting successfully',
            description: 'Message deleted successfully',
            className: 'bg-white'
        })
        refresh();
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <ChatBubbleAction
                    variant="outline"
                    className="size-6"
                    icon={<Trash2 className="size-4" />}
                />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Delete Message</DialogTitle>
                </DialogHeader>
                <div className="w-full">
                    <Label htmlFor="name" className="text-right">
                        Are you sure to delete this message?
                    </Label>
                </div>
                <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>No</Button>
                    <Button variant="destructive" type="submit" onClick={onDelete}>Yes</Button>
                </DialogFooter>
                
            </DialogContent>
        </Dialog>
    );
}