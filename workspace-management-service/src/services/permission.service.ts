import { Permission, Workspace } from "@prisma/client";
import { db } from "../utils/db";
import { CreatePermissionInput, UpdatePermissionInput } from "../dto/permission.dto"; // Import DTOs
import { NotFoundError } from "elysia";
import { BadRequestError } from "../utils/error";

export default class PermissionService {
    async getPermissionsByWorkspaceId(workspaceId: number): Promise<Permission[]> {
        // Check if there is workspace
        const workspace = await db.workspace.findUnique({
            where: {
                id: workspaceId
            }
        });
        if (!workspace) throw new NotFoundError()
            
        return await db.permission.findMany({
            where: {
                workspaceId
            }
        });
    }

    async getPermissionById(workspaceId: number, permissionId: number): Promise<Permission | null> {
        const permission = await db.permission.findUnique({
            where: {
                id: permissionId,
                workspaceId
            }
        });

        if (!permission) throw new NotFoundError()

        return permission
    }

    async createPermission(workspaceId: number, data: CreatePermissionInput): Promise<Permission> {
        // Check if there is workspace
        const workspace = await db.workspace.findUnique({
            where: {
                id: workspaceId
            }
        });
        if (!workspace) throw new NotFoundError()
        
        try {
            const permission = await db.permission.create({
                data: {
                    workspaceId,
                    ...data
                }
            });

            return permission
        } catch (err) {
            throw new BadRequestError("The permission already exists")
        }
        
    }

    async updatePermission(workspaceId: number, permissionId: number, data: UpdatePermissionInput): Promise<Permission | null> {
        try {
            return await db.permission.update({
                where: {
                    id: permissionId,
                    workspaceId
                },
                data
            });
        } catch (error) {
            throw new NotFoundError()
        }
    }

    async deletePermission(workspaceId: number, permissionId: number): Promise<boolean> {
        try {
            await db.permission.delete({
                where: {
                    id: permissionId,
                    workspaceId
                }
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}