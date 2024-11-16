import { PermissionType } from "@prisma/client"
import { Static, t } from "elysia"

export const CreateWorkspaceBody = t.Object({
    ownerId: t.Optional(t.String({
        minLength: 1
    })),
    name: t.String({
        error: "name is required",
        minLength: 1
    }),
    description: t.Optional(t.String({
        error: "description must have a length at most 1024",
        maxLength: 1024
    }))
})

export type CreateWorkspaceInput = Static<typeof CreateWorkspaceBody>

export const UpdateWorkspaceBody = t.Object({
    name: t.Optional(t.String({
        error: "name is required",
        minLength: 1
    })),
    description: t.Optional(t.String({
        error: "description must have a length at most 1024",
        maxLength: 1024
    })),
    globalSharingType: t.Optional(t.Enum(PermissionType))  
})

export type UpdateWorkspaceInput = Static<typeof UpdateWorkspaceBody>