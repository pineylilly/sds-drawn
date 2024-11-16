import { ServerWritableStream } from "@grpc/grpc-js";
import { JoinRoomRequest__Output } from "../proto/generatedTypes/collaboration/JoinRoomRequest";
import { ConnectionResponse } from "../proto/generatedTypes/collaboration/ConnectionResponse";
import { CollaborationAction } from "../proto/generatedTypes/collaboration/CollaborationAction";
import cacheManager from "./cacheManager";
import redisClient from "../utils/db_redis";
import { db } from "../utils/db";



class CollaborationManager {
    private connections: Map<number, Map<string, ServerWritableStream<JoinRoomRequest__Output, ConnectionResponse>>> = new Map<number, Map<string, ServerWritableStream<JoinRoomRequest__Output, ConnectionResponse>>>([]);
    private static _instance: CollaborationManager

    private constructor() {}

    public static get instance(): CollaborationManager {
        if (!CollaborationManager._instance) {
            CollaborationManager._instance = new CollaborationManager()
        }
        return CollaborationManager._instance
    }

    public addConnection(workspaceId: number, userId: string, stream: ServerWritableStream<JoinRoomRequest__Output, ConnectionResponse>) {
        if (!this.connections.has(workspaceId)) {
            this.connections.set(workspaceId, new Map<string, ServerWritableStream<JoinRoomRequest__Output, ConnectionResponse>>())
        }
        this.connections.get(workspaceId)?.set(userId, stream)
        collaborationManager.broadcastMessage(workspaceId, userId.toString(), JSON.stringify(this.getUserList(workspaceId)), "UPDATE_CONNECTION", true)

        // this.broadcastMessage(workspaceId, userId, {
        //     action: "UPDATE_CONNECTION",

        // })
    }

    public removeConnection(workspaceId: number, userId: string) {
        if (!this.connections.has(workspaceId)) return
        this.connections.get(workspaceId)?.delete(userId)
        if (this.connections.get(workspaceId)?.size === 0) {
            this.connections.delete(workspaceId)
        }
        collaborationManager.broadcastMessage(workspaceId, userId.toString(), JSON.stringify(this.getUserList(workspaceId)), "UPDATE_CONNECTION", true)

    }

    public getUserList(workspaceId: number): string[] {
        return Array.from(this.connections.get(workspaceId)?.keys() || [])
    }

    public broadcastMessage(workspaceId: number, senderId: string, message: string,action: CollaborationAction = "UPDATE_CONNECTION", includeSender: boolean = false) {
        if (!this.connections.has(workspaceId)) return
        const responseData : ConnectionResponse  = {
            action: action,
            data: message,
        }
        this.connections.get(workspaceId)?.forEach((stream, userId) => {
            if (!includeSender && userId === senderId) return;
            stream.write(responseData);
        })
    }

    public async getDrawingState(workspaceId: number): Promise<any[]> {
        // if (!this.drawingState.has(workspaceId)) {
        //     this.drawingState.set(workspaceId, [])
        //     return [];
        // } else {
        //     return this.drawingState.get(workspaceId) || []
        // }
        if (await cacheManager.hasDrawingState(workspaceId)){
            return cacheManager.getDrawingState(workspaceId);
        }
        return [];
    }

    public async getImageState(workspaceId: number): Promise<any[]> {
        // if (!this.imageState.has(workspaceId)) {
        //     this.imageState.set(workspaceId, [])
        //     return [];
        // } else {
        //     return this.imageState.get(workspaceId) || []
        // }
        if (await cacheManager.hasImageState(workspaceId)){
            return cacheManager.getImageState(workspaceId);
        }
        return [];
    }

    public async excuteDrawingAction(workspaceId: number, action: CollaborationAction, data: string) {
        // if (!this.drawingState.has(workspaceId)) {
        //     this.drawingState.set(workspaceId, [])
        // }
        //console.log(action);
        //console.log(data);
        
        if (action === CollaborationAction.ADD_ELEMENT){
            // add element to array
            const objectData: any[] = JSON.parse(data);
            // for (const element of objectData) {
            //     // this.drawingState.get(workspaceId)?.push(element);
            //     cacheManager.pushDrawingState(workspaceId, element);
            // }
            const promises = objectData.map(async (element) => {
                return cacheManager.pushDrawingState(workspaceId, element);
            })

            await Promise.all(promises);
            //console.log(this.drawingState.get(workspaceId));
            return;
            
        } else if (action === CollaborationAction.DELETE_ELEMENT || action === CollaborationAction.UPDATE_ELEMENT) {
            // const index = this.drawingState.get(workspaceId)?.findIndex(element => element.id === objectData.id);
            // if (index !== undefined && index !== -1) {
            //     // update element in array
            //     this.drawingState.get(workspaceId)?.splice(index, 1, objectData);
            // }
            const indices : number[] = [];
            const searchID = new Set<string>();
            const objectData: any[] = JSON.parse(data);
            for (const element of objectData){
                searchID.add(element.id);
            }
            const drawingState = await this.getDrawingState(workspaceId);
            for (let i = 0; i < drawingState.length; i++){
                if (searchID.has(drawingState[i].id)){
                    indices.push(i);
                }
            }
            // for (const index of indices){
            //     //this.getDrawingState(workspaceId).splice(index, 1, objectData[indices.indexOf(index)]);
            //     cacheManager.replaceDrawingState(workspaceId, objectData[indices.indexOf(index)], index);
            // }
            const promises = indices.map(async (index) => {
                return cacheManager.replaceDrawingState(workspaceId, objectData[indices.indexOf(index)], index);
            })

            await Promise.all(promises);
            
        } else if (action === CollaborationAction.ADD_IMAGE){
            // store image data
            const objectData: any = JSON.parse(data);
            // if (!this.imageState.has(workspaceId)) {
            //     this.imageState.set(workspaceId, [])
            // }
            // this.imageState.get(workspaceId)?.push(objectData);
            await cacheManager.pushImageState(workspaceId, objectData);
        }
    }

    public async getDrawingResponse(workspaceId: number): Promise<string> {
        // if (!this.drawingState.has(workspaceId)) {
        //     this.drawingState.set(workspaceId, [])
        //     return JSON.stringify([]);
        // } else {
        //     return JSON.stringify(this.drawingState.get(workspaceId)) || JSON.stringify([]);
        // }
        return JSON.stringify(await cacheManager.getDrawingState(workspaceId));
    }

    public async getImageDataResponse(workspaceId: number): Promise<string> {
        // if (!this.imageState.has(workspaceId)) {
        //     this.imageState.set(workspaceId, [])
        //     return JSON.stringify([]);
        // } else {
        //     return JSON.stringify(this.imageState.get(workspaceId)) || JSON.stringify([]);
        // }
        return JSON.stringify(await cacheManager.getImageState(workspaceId));
    }

    public async pushStateToDatabase(){
        //const drawingState = await cacheManager.getDrawingState()
        const workspaceIds = await cacheManager.getAllDrawingWorkspaceIds();
        const [isDirtyDrawingStates, isDirtyImageStates] = await Promise.all([cacheManager.checkDirtyDrawingState(workspaceIds), cacheManager.checkDirtyImageState(workspaceIds)]);
        const promise: Promise<any>[] = [];
        for (let i = 0; i < workspaceIds.length; i++){
            const workspaceId = workspaceIds[i];

            const isDirtyDrawingState = isDirtyDrawingStates[i];
            const isDirtyImageState = isDirtyImageStates[i];
            if (!isDirtyDrawingState && !isDirtyImageState){
                continue;
            }
            const drawingStateString = (isDirtyDrawingState) ? (await cacheManager.getDrawingState(workspaceId)).map(element => JSON.stringify(element)) : undefined;
            const imageStateString = (isDirtyImageState) ? (await cacheManager.getImageState(workspaceId)).map(element => JSON.stringify(element)) : undefined;
            //const drawingStateString = drawingState.map(element => JSON.stringify(element));
            //const imageStateString = imageState.map(element => JSON.stringify(element));
            const found = await db.board.findUnique({
                where: {
                    workspaceId: workspaceId
                }
            })
            if (found){
                promise.push(db.board.update({
                    where: {
                        workspaceId: workspaceId
                    },
                    data: {
                        drawingState: drawingStateString,
                        imageState: imageStateString
                    }
                }))
            } else {
                promise.push(db.board.create({
                    data: {
                        workspaceId: workspaceId,
                        drawingState: drawingStateString,
                        imageState: imageStateString
                    }
                }))
            }
            console.log(`pushing workspaceId ${workspaceId} to database with dirty drawing state ${isDirtyDrawingState} and dirty image state ${isDirtyImageState}`);
            if (isDirtyDrawingState){
                promise.push(cacheManager.clearDirtyDrawingState(workspaceId));
            }
            if (isDirtyImageState){
                promise.push(cacheManager.clearDirtyImageState(workspaceId));
            }
        }
        await Promise.all(promise);
        return;
    }

    public async checkUserPermission(workspaceId: number, userId: string, role: string) : Promise<PermissionType>{
        console.log(`${process.env.WORKSPACE_BACKEND_URL}/workspaces/${workspaceId}/checkPermission`)
        const result = await fetch(`${process.env.WORKSPACE_BACKEND_URL}/workspaces/${workspaceId}/checkPermission`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-role': role,
                'x-id': userId
            }});
        if (result.ok){
           return (await result.json()).permission;
        }
        console.log(result.status);
        return"no";
    }

}

const collaborationManager = CollaborationManager.instance
export type PermissionType = "no" | "viewer" | "editor";
export default collaborationManager