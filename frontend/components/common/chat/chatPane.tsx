"use client";

import { useEffect, useRef, useState } from "react";
import { ChatInput } from "../../ui/chat/chat-input";
import { Button } from "../../ui/button";
import { BotIcon, CornerDownLeft, DeleteIcon, Icon, Trash2 } from "lucide-react";
import { ChatMessageList } from "../../ui/chat/chat-message-list";
import { ChatBubble, ChatBubbleAction, ChatBubbleAvatar, ChatBubbleMessage } from "../../ui/chat/chat-bubble";
import { useParams } from "next/navigation";
import { streamingFetch } from "@/lib/streaming";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, ReceiveChatMessage } from "@/types/ChatMessage";
import { useUser } from "@/lib/hooks/UserContext";
import { useStorage } from "@/lib/hooks/StorageContext";
import DeleteMessageDialog from "./deleteMessageDialog";
import EditMessageDialog from "./editMessageDialog";

export default function ChatPane({ viewing=false }: { viewing?: boolean }) {
    const params = useParams<{ id: string }>()
    const { toast } = useToast()
    const { currentUser } = useUser()
    const { userFetchStorage, batchFetchUsers, getUser } = useStorage()

    const initialized = useRef<boolean>(false)

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState<string>("");

    const messagesRef = useRef<HTMLDivElement>(null);

    async function onSubmit (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); 
        // setMessages([...messages, inputMessage]);
        await sendMessage();
        setInputMessage("");
    };
    
    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages]);

    async function fetchMessages() {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/chat/" + params.id + "/messages",{
            credentials : 'include',
          });
        if (!response.ok) {
            toast({
                variant: "destructive",
                title: "Failed to fetch messages",
                description: "An error occurred while fetching messages",
            })
            return
        }
        const data: {messages: ChatMessage[]} = await response.json();
        console.log(data)
        setMessages(data.messages);
        const distinctUserIds = Array.from(new Set(data.messages.map((message) => message.userId)))
        batchFetchUsers(distinctUserIds)
    }

    async function getMessages() {
        for await ( let chunk of streamingFetch( () => fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/chat/" + params.id + "/receive", {
            method: 'POST',
            credentials: 'include',
        }) ) ) {
            console.log(chunk)
            const data: ReceiveChatMessage = JSON.parse(chunk)
            if (data.action === "CREATE") {
                setMessages((messages) => [...messages, data.message])
            } else if (data.action === "UPDATE") {
                editMessageFromArray(data.message.id, data.message.text)
            } else if (data.action === "DELETE") {
                deleteMessageFromArray(data.message.id)
            }
        }
    }

    async function deleteMessageFromArray(messageId: string) {
        setMessages(messages => messages.filter((message) => message.id !== messageId))
    }

    async function editMessageFromArray(messageId: string, text: string) {
        setMessages(messages => messages.map((message) => {
            if (message.id === messageId) {
                return {
                    ...message,
                    text: text
                }
            }
            return message
        }))
    }

    async function sendMessage() {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/chat/" + params.id + "/messages",{
            method: 'POST',
            credentials : 'include',
            body: JSON.stringify({
                userId: currentUser?.id,
                text: inputMessage
            })
        });
        if (!response.ok) {
            toast({
                variant: "destructive",
                title: "Failed to send message",
                description: "An error occurred while sending message",
            })
            return
        }
    }

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            getMessages()
        }
    }, [])

    useEffect(() => {
        fetchMessages()
    }, [])


    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full grow">

            </div>
            {
                (messages.length === 0) && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Start chating here!
                    </div>
                )
            }
            {
                (messages.length > 0) && (
                    <ChatMessageList ref={messagesRef}>
                        {
                            messages.map((message, index) => (
                                <ChatBubble
                                    key={message.id}
                                    variant={(message.userId === currentUser?.id) ? "sent" : "received"}
                                //   variant={message.role == "user" ? "sent" : "received"}
                                
                                >

                                    <ChatBubbleAvatar
                                      src={(message.userId === currentUser?.id) ? currentUser?.avatar : userFetchStorage.get(message.userId)?.avatar}
                                      fallback={(message.userId === currentUser?.id) ? "👨🏽" : "🤖"}
                                    />
                                    <ChatBubbleMessage className="gap-3">
                                        <div className="text-sm font-semibold">{(message.userId === currentUser?.id) ? currentUser?.displayName : getUser(message.userId)?.displayName || ""}</div>
                                        <div className="text-xs">{new Date(message.createdAt).toLocaleString()}</div>
                                        <div className="text-sm">{message.text}</div>
                                        {(message.userId === currentUser?.id) && (
                                            <div className="flex items-center mt-1.5 gap-1">
                                                <DeleteMessageDialog messageId={message.id} refresh={() => deleteMessageFromArray(message.id)} />
                                                <EditMessageDialog message={message} refresh={editMessageFromArray} />
                                            </div>
                                        )}
                                    </ChatBubbleMessage>
                                </ChatBubble>
                            ))
                        }
                    </ChatMessageList>
                )
            }
            <div className="w-full h-16 bg-secondary">
                <form onSubmit={onSubmit} className="w-full px-2 py-2 flex gap-3 items-center">
                    <ChatInput
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={(viewing) ? "You don't have permission to send message" : "Type your message here..."}
                        className="max-h-12 min-h-12 h-12 px-2 py-2 resize-none rounded-lg bg-background shadow-none"
                        disabled={viewing}
                    />
                    <Button
                        disabled={!inputMessage}
                        type="submit"
                        size="sm"
                        className="ml-auto gap-1.5"
                    >
                        Send Message
                        <CornerDownLeft className="size-3.5" />
                    </Button>
                </form>
            </div>
        </div>
    )
}