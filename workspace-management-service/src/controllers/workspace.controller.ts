import Elysia, { NotFoundError, t } from "elysia";
import WorkspaceService from "../services/workspace.service";
import { isNumeric } from "../utils/dataValidator";
import { CreateWorkspaceBody, UpdateWorkspaceBody } from "../dto/workspace.dto";
import { UnauthorizedError } from "../utils/error";

const workspaceService = new WorkspaceService()

export const workspaceController = new Elysia({ prefix: '/workspaces' })

    // GET /workspace/recent
    .get('/recent', async ({ headers }) => {
        if (!headers['x-id'] || !headers['x-role']) return new UnauthorizedError()
        
        const workspaces = await workspaceService.getRecentWorkspaces(headers['x-id'])
    
        return workspaces
    })

    // GET /workspace
    .get('/', async ({ headers }) => {
        if (!headers['x-id'] || !headers['x-role']) return new UnauthorizedError()
        return await workspaceService.getAllWorkspace(headers['x-id'], headers['x-role'])
    })

    // GET /workspace/:id
    .get('/:id', async ({ params, headers }) => {
        if (!isNumeric(params.id)) throw new NotFoundError()
        if (!headers['x-id'] || !headers['x-role']) return new UnauthorizedError()

        const workspace = await workspaceService.getWorkspaceById(parseInt(params.id), headers['x-id'], headers['x-role'])

        if (!workspace) throw new NotFoundError()

        return workspace
    })

    // POST /workspace
    .post('/', async ({ body, headers }) => {
        if (!headers['x-id'] || !headers['x-role']) return new UnauthorizedError()

        const workspace = await workspaceService.createWorkspace(headers['x-id'], body)
        
        return workspace
    }, {
        body: CreateWorkspaceBody
    })

    // PUT /workspace
    .put('/:id', async ({ params, body }) => {
        if (!isNumeric(params.id)) throw new NotFoundError()
        
        const workspace = await workspaceService.updateWorkspace(parseInt(params.id), body)

        if (!workspace) {
            throw new NotFoundError()
        }

        return workspace
    }, {
        body: UpdateWorkspaceBody
    })

    // DELETE /workspace
    .delete('/:id', async ({ params }) => {
        if (!isNumeric(params.id)) throw new NotFoundError()

        const isSuccess = await workspaceService.deleteWorkspace(parseInt(params.id))

        if (!isSuccess) throw new NotFoundError()

        return {
            message: "Success"
        }
    })

    // POST /workspace/:id/checkPermission
    .post('/:id/checkPermission', async ({ params, headers }) => {
        if (!isNumeric(params.id)) throw new NotFoundError()
        if (!headers['x-id'] || !headers['x-role']) return new UnauthorizedError()

        const permission = await workspaceService.checkPermission(parseInt(params.id), headers['x-id'], headers['x-role'])

        return permission
    })

    // POST /workspace/:id/enter
    .post('/:id/enter', async ({ params, headers }) => {
        if (!isNumeric(params.id)) throw new NotFoundError()
        if (!headers['x-id'] || !headers['x-role']) return new UnauthorizedError()

        const permission = await workspaceService.checkPermission(parseInt(params.id), headers['x-id'], headers['x-role'])
        await workspaceService.addRecentWorkspace(headers['x-id'], parseInt(params.id))

        return permission
    })

    