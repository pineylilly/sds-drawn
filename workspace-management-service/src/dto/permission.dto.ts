import { PermissionType } from "@prisma/client";
import { Static, t } from "elysia";

export const CreatePermissionBody = t.Object({
    userId: t.String({
        error: "userId is required"
    }),
    permissionType: t.Enum(PermissionType)
});

export type CreatePermissionInput = Static<typeof CreatePermissionBody>;

export const UpdatePermissionBody = t.Object({
    permissionType: t.Optional(t.Enum(PermissionType))
});

export type UpdatePermissionInput = Static<typeof UpdatePermissionBody>;