import { PermissionType, RecentWorkspace, Workspace } from "@prisma/client";
import { db } from "../utils/db";
import { CreateWorkspaceInput, UpdateWorkspaceInput } from "../dto/workspace.dto";
import { NotFoundError } from "elysia";
import { ForbiddenError } from "../utils/error";

export default class WorkspaceService {
    async getAllWorkspace(userId: string, role: string): Promise<Workspace[]> {
        if (role !== 'admin') {
            return await db.workspace.findMany({
                where: {
                    ownerId: userId
                }
            })
        } else {
            return await db.workspace.findMany()
        }
        
    }

    async getWorkspaceById(id: number, userId: string, role: string): Promise<Workspace | null> {
        const workspace = await db.workspace.findUnique({
            where: {
                id: id
            },
            include: {
                permissions: true
            }
        })

        if (!workspace) throw new NotFoundError("Workspace not found")

        return workspace
    }

    async createWorkspace(userId: string, data: CreateWorkspaceInput): Promise<Workspace> {
        return await db.workspace.create({
            data: {
                ownerId: userId,
                ...data
            }
        })
    }

    async updateWorkspace(id: number, data: UpdateWorkspaceInput): Promise<Workspace | null> {
        try {
            return await db.workspace.update({
                where: {
                    id: id
                },
                data: data
            })
        } catch (error) {
            return null
        }
        
    }

    async deleteWorkspace(id: number): Promise<boolean> {
        try {
            await db.workspace.delete({
                where: {
                    id: id
                }
            })
            return true
        } catch (error) {
            return false
        }
    }

    async checkPermission(id: number, userId: string, role: string): Promise<{ permission: PermissionType } | null> {
        const workspace = await db.workspace.findUnique({
            where: {
                id: id
            }
        })

        if (!workspace) throw new NotFoundError("Workspace not found")
        
        // Editor

        if (workspace.ownerId === userId || role === 'admin') {
            return {
                permission: PermissionType.editor
            }
        }

        if (workspace.globalSharingType === 'editor') {
            return {
                permission: PermissionType.editor
            }
        }

        const permission = await db.permission.findFirst({
            where: {
                workspaceId: id,
                userId: userId
            }
        })

        if (permission && permission.permissionType === PermissionType.editor) {
            return {
                permission: PermissionType.editor
            }
        }

        // Viewer

        if (workspace.globalSharingType === 'viewer') {
            return {
                permission: PermissionType.viewer
            }
        }

        if (permission && permission.permissionType === PermissionType.viewer) {
            return {
                permission: PermissionType.viewer
            }
        }

        throw new ForbiddenError("You don't have permission to access this workspace")
    }

    async getRecentWorkspaces(userId: string): Promise<RecentWorkspace[]> {
        return await db.recentWorkspace.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                latestView: 'desc'
            },
            include: {
                workspace: true
            }
        })
    }

    async addRecentWorkspace(userId: string, workspaceId: number): Promise<RecentWorkspace> {
        const recentWorkspace = await db.recentWorkspace.findFirst({
            where: {
                userId: userId,
                workspaceId: workspaceId
            }
        })

        if (recentWorkspace) {
            return await db.recentWorkspace.update({
                where: {
                    id: recentWorkspace.id
                },
                data: {
                    latestView: new Date()
                }
            })
        } else {
            return await db.recentWorkspace.create({
                data: {
                    userId: userId,
                    workspaceId: workspaceId
                }
            })
        }
    }
}