import path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { ProtoGrpcType } from './proto/generatedTypes/collaboration';
import { GetRoom, GetRoomDrawing, JoinRoom, UpdateExcalidraw, UploadImageFile } from './services/collaborationService';
import redisClient from './utils/db_redis';
import collaborationManager from './data/collaborationManager';
import cacheManager from './data/cacheManager';

const PORT = 8083
const SERVER_URI = `0.0.0.0:${PORT}`;

const PROTO_FILE = './proto/collaboration.proto'

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE))
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType
const chatPackage = grpcObj.collaboration

const server = new grpc.Server()

server.addService(chatPackage.Collaboration.service, {
    GetRoom,
    JoinRoom,
    UpdateExcalidraw,
    GetRoomDrawing,
    UploadImageFile,
})


server.bindAsync(SERVER_URI, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`Your server as started on port ${port}`)
    const dbPush = setInterval(async () => {
      console.log('pushing to mongo')
      await collaborationManager.pushStateToDatabase();
    },30000)
    // server.start()
});