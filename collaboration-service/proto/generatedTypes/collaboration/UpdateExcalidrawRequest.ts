// Original file: proto/collaboration.proto

import type { CollaborationAction as _collaboration_CollaborationAction, CollaborationAction__Output as _collaboration_CollaborationAction__Output } from '../collaboration/CollaborationAction';

export interface UpdateExcalidrawRequest {
  'workspaceId'?: (number);
  'action'?: (_collaboration_CollaborationAction);
  'data'?: (string);
}

export interface UpdateExcalidrawRequest__Output {
  'workspaceId'?: (number);
  'action'?: (_collaboration_CollaborationAction__Output);
  'data'?: (string);
}
