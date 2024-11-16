// Original file: proto/collaboration.proto

export const CollaborationAction = {
  UPDATE_CONNECTION: 0,
  ADD_ELEMENT: 1,
  UPDATE_ELEMENT: 2,
  DELETE_ELEMENT: 3,
  ADD_IMAGE: 4,
} as const;

export type CollaborationAction =
  | 'UPDATE_CONNECTION'
  | 0
  | 'ADD_ELEMENT'
  | 1
  | 'UPDATE_ELEMENT'
  | 2
  | 'DELETE_ELEMENT'
  | 3
  | 'ADD_IMAGE'
  | 4

export type CollaborationAction__Output = typeof CollaborationAction[keyof typeof CollaborationAction]
