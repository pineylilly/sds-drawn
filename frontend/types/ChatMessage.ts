export type ChatMessage = {
    id: string;
    userId: string;
    workspaceId: number;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ReceiveChatMessage = {
    action: "CREATE" | "UPDATE" | "DELETE";
    message: ChatMessage;
}