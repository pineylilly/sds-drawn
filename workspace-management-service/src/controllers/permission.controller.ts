import Elysia, { NotFoundError } from "elysia";
import PermissionService from "../services/permission.service";
import { CreatePermissionBody, UpdatePermissionBody } from "../dto/permission.dto";
import { isNumeric } from "../utils/dataValidator";

const permissionService = new PermissionService();

export const permissionController = new Elysia({ prefix: '/workspaces/:id/permissions' })

    // GET /workspaces/:id/permissions
    .get('/', async ({ params }) => {
        if (!isNumeric(params.id)) throw new NotFoundError()
        const permissions = await permissionService.getPermissionsByWorkspaceId(parseInt(params.id));
        return permissions;
    })

    // GET /workspaces/:id/permissions/:permissionId
    .get('/:permissionId', async ({ params }) => {
        if (!isNumeric(params.id) || !isNumeric(params.permissionId)) throw new NotFoundError()
        const permission = await permissionService.getPermissionById(parseInt(params.id), parseInt(params.permissionId));
        if (!permission) throw new NotFoundError()
        return permission;
    })

    // POST /workspaces/:id/permissions
    .post('/', async ({ params, body }) => {
        const permission = await permissionService.createPermission(parseInt(params.id), body);
        return permission;
    }, {
        body: CreatePermissionBody
    })

    // PUT /workspaces/:id/permissions/:permissionId
    .put('/:permissionId', async ({ params, body }) => {
        if (!isNumeric(params.id) || !isNumeric(params.permissionId)) throw new NotFoundError()
        const permission = await permissionService.updatePermission(parseInt(params.id), parseInt(params.permissionId), body);
        if (!permission) throw new NotFoundError()
        return permission;
    }, {
        body: UpdatePermissionBody
    })

    // DELETE /workspaces/:id/permissions/:permissionsId
    .delete('/:permissionId', async ({ params }) => {
        if (!isNumeric(params.id) || !isNumeric(params.permissionId)) throw new NotFoundError()
        const isSuccess = await permissionService.deletePermission(parseInt(params.id), parseInt(params.permissionId));
        if (!isSuccess) throw new NotFoundError()
        return { message: isSuccess ? 'Success' : 'Failed' };
    });