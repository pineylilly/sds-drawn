import { Metadata, sendUnaryData, ServerUnaryCall, ServerWritableStream, status } from "@grpc/grpc-js";
import { GetRoomRequest__Output } from "../proto/generatedTypes/collaboration/GetRoomRequest";
import { GetRoomResponse } from "../proto/generatedTypes/collaboration/GetRoomResponse";
import collaborationManager from "../data/collaborationManager";
import { JoinRoomRequest, JoinRoomRequest__Output } from "../proto/generatedTypes/collaboration/JoinRoomRequest";
import { ConnectionResponse } from "../proto/generatedTypes/collaboration/ConnectionResponse";
import { UpdateExcalidrawRequest, UpdateExcalidrawRequest__Output } from "../proto/generatedTypes/collaboration/UpdateExcalidrawRequest";
import { Empty } from "../proto/generatedTypes/collaboration/Empty";
import { GetRoomDrawingResponse } from "../proto/generatedTypes/collaboration/GetRoomDrawingResponse";
import { UploadImageFileRequest__Output } from "../proto/generatedTypes/collaboration/UploadImageFileRequest";
import { uploadImage } from "../utils/firebase";
import { CollaborationAction } from "../proto/generatedTypes/collaboration/CollaborationAction";
import redisClient from "../utils/db_redis";
//import collaborationCacheManager from "../data/collaborationCacheManager";

export async function GetRoom(call: ServerUnaryCall<GetRoomRequest__Output, GetRoomResponse>, callback: sendUnaryData<GetRoomResponse>) {
    console.log('GetRoom called with', call.request)
    const userId = (call.metadata.get('x-id').length > 0) ? call.metadata.get('x-id')[0] : null
    const role = (call.metadata.get('x-role').length > 0) ? call.metadata.get('x-role')[0] : null
    if (!userId || !role) {
        call.emit('error', {
            code: status.INVALID_ARGUMENT,
            message: 'userId is required'
        })
        return
    }

    if (!call.request.workspaceId) {
        call.emit('error', {
            code: status.INVALID_ARGUMENT,
            message: 'workspaceId is required'
        })
        return
    }
    

   


    const origin = (call.metadata.get('origin').length > 0) ? call.metadata.get('origin')[0] : null

    const outgoingHeaders = new Metadata();
    outgoingHeaders.set('origin', (origin) ? origin : '*');
    outgoingHeaders.set('Access-Control-Allow-Credentials', 'true');
    call.sendMetadata(outgoingHeaders)

    const permission = await collaborationManager.checkUserPermission(call.request.workspaceId, userId.toString(), role.toString());
    if (permission === "no"){
        call.emit('error', {
            code: status.INVALID_ARGUMENT,
            message: 'permission denied'
        })
        return
    }
    const data = {
        users: collaborationManager.getUserList(call.request.workspaceId || 0)
    }

    callback(null, data)
}

export async function JoinRoom(call: ServerWritableStream<JoinRoomRequest__Output, ConnectionResponse>) {
    console.log('JoinRoom called with', call.request)
    const userId = (call.metadata.get('x-id').length > 0) ? call.metadata.get('x-id')[0] : null
    const role = (call.metadata.get('x-role').length > 0) ? call.metadata.get('x-role')[0] : null
    // Validate request
    if (!userId || !role) {
        call.emit('error', {
            code: status.INVALID_ARGUMENT,
            message: 'userId is required'
        })
        return
    }

    if (!call.request.workspaceId) {
        call.emit('error', {
            code: status.INVALID_ARGUMENT,
            message: 'workspaceId is required'
        })
        return
    }

    call.on('cancelled', () => {
        console.log('Stream cancelled', call.request)
        collaborationManager.removeConnection(call.request.workspaceId || -1, userId.toString() || "")
    })

    call.on('error', function(e) {
        console.log('Stream error', call.request)
        collaborationManager.removeConnection(call.request.workspaceId || -1, userId.toString() || "")
    });

    const origin = (call.metadata.get('origin').length > 0) ? call.metadata.get('origin')[0] : null

    const outgoingHeaders = new Metadata();
    outgoingHeaders.set('origin', (origin) ? origin : '*');
    outgoingHeaders.set('Access-Control-Allow-Credentials', 'true');
    call.sendMetadata(outgoingHeaders)
    const permission = await collaborationManager.checkUserPermission(call.request.workspaceId, userId.toString(), role.toString());
    if (permission === "no") {
        call.emit('error', {
            code: status.PERMISSION_DENIED,
            message: 'permission denied'
        })
        return
    }
    collaborationManager.addConnection(call.request.workspaceId, userId.toString(), call)
}

export async function UpdateExcalidraw(call: ServerUnaryCall<UpdateExcalidrawRequest__Output,Empty>, callback: sendUnaryData<Empty>){
    console.log('UpdateExcalidraw called with', call.request);
    const userId = (call.metadata.get('x-id').length > 0) ? call.metadata.get('x-id')[0] : null;
    const role = (call.metadata.get('x-role').length > 0) ? call.metadata.get('x-role')[0] : null;
    // Validate request
    if (!userId || !role) {
        call.emit('error', {
            code: status.INVALID_ARGUMENT,
            message: 'userId is required'
        });
        return;
    }

    if (!call.request.workspaceId) {
        call.emit('error', {
            code: status.INVALID_ARGUMENT,
            message: 'workspaceId is required'
        });
        return;
    }


    if (!call.request.data || !call.request.action) {
        call.emit('error', {
            code: status.INVALID_ARGUMENT,
            message: 'data and action are required'
        });
        return;
    }
    const origin = (call.metadata.get('origin').length > 0) ? call.metadata.get('origin')[0] : null;
    const outgoingHeaders = new Metadata();
    outgoingHeaders.set('origin', (origin) ? origin : '*');
    outgoingHeaders.set('Access-Control-Allow-Credentials', 'true');
    call.sendMetadata(outgoingHeaders)
    
    const permission = await collaborationManager.checkUserPermission(call.request.workspaceId, userId.toString(), role.toString());
    if (permission === "editor") {
        collaborationManager.broadcastMessage(call.request.workspaceId, userId.toString(), call.request.data, call.request.action)
        await collaborationManager.excuteDrawingAction(call.request.workspaceId, call.request.action, call.request.data);
        //console.log("current drawing state", collaborationCacheManager.getDrawingResponse(call.request.workspaceId));
    } else {
        console.log("permission denied cannot excute drawing action to other user");
    }
    
    
    callback(null, {});
}

export async function GetRoomDrawing(call: ServerUnaryCall<GetRoomRequest__Output, GetRoomDrawingResponse>, callback: sendUnaryData<GetRoomDrawingResponse>) {
    console.log('GetRoomDrawing called with', call.request)
    const userId = (call.metadata.get('x-id').length > 0) ? call.metadata.get('x-id')[0] : null
    const role = (call.metadata.get('x-role').length > 0) ? call.metadata.get('x-role')[0] : null

    if (!userId || !role) {
        call.emit('error', {
            code: status.INVALID_ARGUMENT,
            message: 'userId is required'
        })
        return
    }

    if (!call.request.workspaceId) {
        call.emit('error', {
            code: status.INVALID_ARGUMENT,
            message: 'workspaceId is required'
        })
        return
    }
    console.log('permission',await collaborationManager.checkUserPermission(call.request.workspaceId, userId.toString(), role.toString()));

    const origin = (call.metadata.get('origin').length > 0) ? call.metadata.get('origin')[0] : null
    const outgoingHeaders = new Metadata();
    outgoingHeaders.set('origin', (origin) ? origin : '*');
    outgoingHeaders.set('Access-Control-Allow-Credentials', 'true');
    call.sendMetadata(outgoingHeaders)

    const permission = await collaborationManager.checkUserPermission(call.request.workspaceId, userId.toString(), role.toString());
    if (permission !== "no") {
        const data = await collaborationManager.getDrawingResponse(call.request.workspaceId);
        const imageData = await collaborationManager.getImageDataResponse(call.request.workspaceId);
        callback(null, {data: data, imageData: imageData});
    } else {
        console.log("permission denied cannot retrieve drawing and image data from other user");
        // call.emit('error', {
        //     code: status.PERMISSION_DENIED,
        //     message: 'permission denied'
        // })
        callback(null, {data: '[]', imageData: '[]'});
        
    }
    //console.log(data);

    
}

export async function UploadImageFile(call : ServerUnaryCall<UploadImageFileRequest__Output,Empty>, callback: sendUnaryData<Empty>){
    console.log('UploadImageFile called with', call.request)
    const userId = (call.metadata.get('x-id').length > 0) ? call.metadata.get('x-id')[0] : null
    const role = (call.metadata.get('x-role').length > 0) ? call.metadata.get('x-role')[0] : null
    // Validate request
    if (!userId || !role) {
        call.emit('error', {
            code: status.INVALID_ARGUMENT,
            message: 'userId is required'
        });
        return;
    }

    if (!call.request.workspaceId) {
        call.emit('error', {
            code: status.INVALID_ARGUMENT,
            message: 'workspaceId is required'
        });
        return;
    }

    if (!call.request.fileData) {
        call.emit('error', {
            code: status.INVALID_ARGUMENT,
            message: 'file is required'
        });
        return;
    }

    if (!call.request.fileID || !call.request.fileID || !call.request.fileMimeType) {
        call.emit('error', {
            code: status.INVALID_ARGUMENT,
            message: 'file metadata is required'
        });
        return;
    }

    const origin = (call.metadata.get('origin').length > 0) ? call.metadata.get('origin')[0] : null
    const outgoingHeaders = new Metadata();
    outgoingHeaders.set('origin', (origin) ? origin : '*');
    outgoingHeaders.set('Access-Control-Allow-Credentials', 'true');
    call.sendMetadata(outgoingHeaders)

    const permission = await collaborationManager.checkUserPermission(call.request.workspaceId, userId.toString(), role.toString());
    if (permission === "editor") {
        const fileObject = JSON.parse(call.request.fileData);
        const fileURL = await uploadImage(fileObject.dataURL, call.request.fileID, call.request.workspaceId, call.request.fileMimeType, "images");
        fileObject.dataURL = fileURL;
        const newFileObjectData = JSON.stringify(fileObject);
        // upload to server
        await collaborationManager.excuteDrawingAction(call.request.workspaceId, CollaborationAction.ADD_IMAGE, newFileObjectData);
        // broadcast to all users except the sender
        collaborationManager.broadcastMessage(call.request.workspaceId, userId.toString(), newFileObjectData, "ADD_IMAGE", false);

        console.log("current drawing state", await collaborationManager.getImageState(call.request.workspaceId));
    } else {
        console.log("permission denied cannot excute drawing action to other user and server");
    }

    callback(null, {});
}



