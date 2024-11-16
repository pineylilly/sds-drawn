"use client";

import { Button } from "@/components/ui/button";
import { ChatBubbleAction } from "@/components/ui/chat/chat-bubble";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@/types/ChatMessage";
import { Pencil } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

interface EditMessageDialogProps {
    message: ChatMessage
    refresh: (messageId: string, text: string) => void;
}

export default function EditMessageDialog({message, refresh}: EditMessageDialogProps) {
    const params = useParams<{ id: string }>()
    const { toast } = useToast();

    const [editedMessage, setEditedMessage] = useState<string>(message.text);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    async function onEdit() {
        setIsOpen(false);
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/chat/" + params.id + "/messages/" + message.id, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: editedMessage
            }),
        });
        if (!response.ok) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to edit message',
            });
            return;
        }
        toast({
            title: 'Editing successfully',
            description: 'Message edited successfully',
            className: 'bg-white'
        })
        refresh(message.id, editedMessage);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <ChatBubbleAction
                    variant="outline"
                    className="size-6"
                    icon={<Pencil className="size-4" />}
                />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Edit Message</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col w-full gap-4 py-4">
                    <div className="w-full flex items-center gap-4">
                        <Textarea
                            id="editedMessage"
                            placeholder="Workspace name"
                            className="w-full resize-none h-20"
                            value={editedMessage}
                            onChange={(e) => setEditedMessage(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>Close</Button>
                    <Button type="submit" disabled={(!editedMessage)} onClick={onEdit}>Save</Button>
                </DialogFooter>
                
            </DialogContent>
        </Dialog>
    );
}