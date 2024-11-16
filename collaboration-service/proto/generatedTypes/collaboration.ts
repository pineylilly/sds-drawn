import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { CollaborationClient as _collaboration_CollaborationClient, CollaborationDefinition as _collaboration_CollaborationDefinition } from './collaboration/Collaboration';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  collaboration: {
    Collaboration: SubtypeConstructor<typeof grpc.Client, _collaboration_CollaborationClient> & { service: _collaboration_CollaborationDefinition }
    CollaborationAction: EnumTypeDefinition
    ConnectionResponse: MessageTypeDefinition
    Empty: MessageTypeDefinition
    GetRoomDrawingResponse: MessageTypeDefinition
    GetRoomRequest: MessageTypeDefinition
    GetRoomResponse: MessageTypeDefinition
    JoinRoomRequest: MessageTypeDefinition
    UpdateExcalidrawRequest: MessageTypeDefinition
    UploadImageFileRequest: MessageTypeDefinition
  }
  google: {
    protobuf: {
      Any: MessageTypeDefinition
      Timestamp: MessageTypeDefinition
    }
  }
}

