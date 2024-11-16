export type Workspace = {
    id: string;
    name: string;
    description?: string;
    ownerId: string;
    globalSharingType: "no" | "viewer" | "editor";
    createdAt: Date;
    updatedAt: Date;
}

export type WorkspaceFullData = Workspace & {
    permissions: Permission[];
}

export type Permission = {
    id: string;
    userId: string;
    workspaceId: string;
    permissionType: "no" | "viewer" | "editor";
    createdAt: Date;
    updatedAt: Date;
}