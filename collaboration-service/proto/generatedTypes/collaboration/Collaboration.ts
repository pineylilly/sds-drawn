// Original file: proto/collaboration.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ConnectionResponse as _collaboration_ConnectionResponse, ConnectionResponse__Output as _collaboration_ConnectionResponse__Output } from '../collaboration/ConnectionResponse';
import type { Empty as _collaboration_Empty, Empty__Output as _collaboration_Empty__Output } from '../collaboration/Empty';
import type { GetRoomDrawingResponse as _collaboration_GetRoomDrawingResponse, GetRoomDrawingResponse__Output as _collaboration_GetRoomDrawingResponse__Output } from '../collaboration/GetRoomDrawingResponse';
import type { GetRoomRequest as _collaboration_GetRoomRequest, GetRoomRequest__Output as _collaboration_GetRoomRequest__Output } from '../collaboration/GetRoomRequest';
import type { GetRoomResponse as _collaboration_GetRoomResponse, GetRoomResponse__Output as _collaboration_GetRoomResponse__Output } from '../collaboration/GetRoomResponse';
import type { JoinRoomRequest as _collaboration_JoinRoomRequest, JoinRoomRequest__Output as _collaboration_JoinRoomRequest__Output } from '../collaboration/JoinRoomRequest';
import type { UpdateExcalidrawRequest as _collaboration_UpdateExcalidrawRequest, UpdateExcalidrawRequest__Output as _collaboration_UpdateExcalidrawRequest__Output } from '../collaboration/UpdateExcalidrawRequest';
import type { UploadImageFileRequest as _collaboration_UploadImageFileRequest, UploadImageFileRequest__Output as _collaboration_UploadImageFileRequest__Output } from '../collaboration/UploadImageFileRequest';

export interface CollaborationClient extends grpc.Client {
  GetRoom(argument: _collaboration_GetRoomRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_collaboration_GetRoomResponse__Output>): grpc.ClientUnaryCall;
  GetRoom(argument: _collaboration_GetRoomRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_collaboration_GetRoomResponse__Output>): grpc.ClientUnaryCall;
  GetRoom(argument: _collaboration_GetRoomRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_collaboration_GetRoomResponse__Output>): grpc.ClientUnaryCall;
  GetRoom(argument: _collaboration_GetRoomRequest, callback: grpc.requestCallback<_collaboration_GetRoomResponse__Output>): grpc.ClientUnaryCall;
  getRoom(argument: _collaboration_GetRoomRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_collaboration_GetRoomResponse__Output>): grpc.ClientUnaryCall;
  getRoom(argument: _collaboration_GetRoomRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_collaboration_GetRoomResponse__Output>): grpc.ClientUnaryCall;
  getRoom(argument: _collaboration_GetRoomRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_collaboration_GetRoomResponse__Output>): grpc.ClientUnaryCall;
  getRoom(argument: _collaboration_GetRoomRequest, callback: grpc.requestCallback<_collaboration_GetRoomResponse__Output>): grpc.ClientUnaryCall;
  
  GetRoomDrawing(argument: _collaboration_GetRoomRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_collaboration_GetRoomDrawingResponse__Output>): grpc.ClientUnaryCall;
  GetRoomDrawing(argument: _collaboration_GetRoomRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_collaboration_GetRoomDrawingResponse__Output>): grpc.ClientUnaryCall;
  GetRoomDrawing(argument: _collaboration_GetRoomRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_collaboration_GetRoomDrawingResponse__Output>): grpc.ClientUnaryCall;
  GetRoomDrawing(argument: _collaboration_GetRoomRequest, callback: grpc.requestCallback<_collaboration_GetRoomDrawingResponse__Output>): grpc.ClientUnaryCall;
  getRoomDrawing(argument: _collaboration_GetRoomRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_collaboration_GetRoomDrawingResponse__Output>): grpc.ClientUnaryCall;
  getRoomDrawing(argument: _collaboration_GetRoomRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_collaboration_GetRoomDrawingResponse__Output>): grpc.ClientUnaryCall;
  getRoomDrawing(argument: _collaboration_GetRoomRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_collaboration_GetRoomDrawingResponse__Output>): grpc.ClientUnaryCall;
  getRoomDrawing(argument: _collaboration_GetRoomRequest, callback: grpc.requestCallback<_collaboration_GetRoomDrawingResponse__Output>): grpc.ClientUnaryCall;
  
  JoinRoom(argument: _collaboration_JoinRoomRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_collaboration_ConnectionResponse__Output>;
  JoinRoom(argument: _collaboration_JoinRoomRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_collaboration_ConnectionResponse__Output>;
  joinRoom(argument: _collaboration_JoinRoomRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_collaboration_ConnectionResponse__Output>;
  joinRoom(argument: _collaboration_JoinRoomRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_collaboration_ConnectionResponse__Output>;
  
  UpdateExcalidraw(argument: _collaboration_UpdateExcalidrawRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_collaboration_Empty__Output>): grpc.ClientUnaryCall;
  UpdateExcalidraw(argument: _collaboration_UpdateExcalidrawRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_collaboration_Empty__Output>): grpc.ClientUnaryCall;
  UpdateExcalidraw(argument: _collaboration_UpdateExcalidrawRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_collaboration_Empty__Output>): grpc.ClientUnaryCall;
  UpdateExcalidraw(argument: _collaboration_UpdateExcalidrawRequest, callback: grpc.requestCallback<_collaboration_Empty__Output>): grpc.ClientUnaryCall;
  updateExcalidraw(argument: _collaboration_UpdateExcalidrawRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_collaboration_Empty__Output>): grpc.ClientUnaryCall;
  updateExcalidraw(argument: _collaboration_UpdateExcalidrawRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_collaboration_Empty__Output>): grpc.ClientUnaryCall;
  updateExcalidraw(argument: _collaboration_UpdateExcalidrawRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_collaboration_Empty__Output>): grpc.ClientUnaryCall;
  updateExcalidraw(argument: _collaboration_UpdateExcalidrawRequest, callback: grpc.requestCallback<_collaboration_Empty__Output>): grpc.ClientUnaryCall;
  
  UploadImageFile(argument: _collaboration_UploadImageFileRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_collaboration_Empty__Output>): grpc.ClientUnaryCall;
  UploadImageFile(argument: _collaboration_UploadImageFileRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_collaboration_Empty__Output>): grpc.ClientUnaryCall;
  UploadImageFile(argument: _collaboration_UploadImageFileRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_collaboration_Empty__Output>): grpc.ClientUnaryCall;
  UploadImageFile(argument: _collaboration_UploadImageFileRequest, callback: grpc.requestCallback<_collaboration_Empty__Output>): grpc.ClientUnaryCall;
  uploadImageFile(argument: _collaboration_UploadImageFileRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_collaboration_Empty__Output>): grpc.ClientUnaryCall;
  uploadImageFile(argument: _collaboration_UploadImageFileRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_collaboration_Empty__Output>): grpc.ClientUnaryCall;
  uploadImageFile(argument: _collaboration_UploadImageFileRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_collaboration_Empty__Output>): grpc.ClientUnaryCall;
  uploadImageFile(argument: _collaboration_UploadImageFileRequest, callback: grpc.requestCallback<_collaboration_Empty__Output>): grpc.ClientUnaryCall;
  
}

export interface CollaborationHandlers extends grpc.UntypedServiceImplementation {
  GetRoom: grpc.handleUnaryCall<_collaboration_GetRoomRequest__Output, _collaboration_GetRoomResponse>;
  
  GetRoomDrawing: grpc.handleUnaryCall<_collaboration_GetRoomRequest__Output, _collaboration_GetRoomDrawingResponse>;
  
  JoinRoom: grpc.handleServerStreamingCall<_collaboration_JoinRoomRequest__Output, _collaboration_ConnectionResponse>;
  
  UpdateExcalidraw: grpc.handleUnaryCall<_collaboration_UpdateExcalidrawRequest__Output, _collaboration_Empty>;
  
  UploadImageFile: grpc.handleUnaryCall<_collaboration_UploadImageFileRequest__Output, _collaboration_Empty>;
  
}

export interface CollaborationDefinition extends grpc.ServiceDefinition {
  GetRoom: MethodDefinition<_collaboration_GetRoomRequest, _collaboration_GetRoomResponse, _collaboration_GetRoomRequest__Output, _collaboration_GetRoomResponse__Output>
  GetRoomDrawing: MethodDefinition<_collaboration_GetRoomRequest, _collaboration_GetRoomDrawingResponse, _collaboration_GetRoomRequest__Output, _collaboration_GetRoomDrawingResponse__Output>
  JoinRoom: MethodDefinition<_collaboration_JoinRoomRequest, _collaboration_ConnectionResponse, _collaboration_JoinRoomRequest__Output, _collaboration_ConnectionResponse__Output>
  UpdateExcalidraw: MethodDefinition<_collaboration_UpdateExcalidrawRequest, _collaboration_Empty, _collaboration_UpdateExcalidrawRequest__Output, _collaboration_Empty__Output>
  UploadImageFile: MethodDefinition<_collaboration_UploadImageFileRequest, _collaboration_Empty, _collaboration_UploadImageFileRequest__Output, _collaboration_Empty__Output>
}
