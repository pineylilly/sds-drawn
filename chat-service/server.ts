import path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { ProtoGrpcType } from './proto/generatedTypes/chat'
import { DeleteMessage, GetMessages, ReceiveMessages, SendMessage, UpdateMessage } from './services/chatService'

const PORT = 8082
const SERVER_URI = `0.0.0.0:${PORT}`;

const PROTO_FILE = './proto/chat.proto'

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE))
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType
const chatPackage = grpcObj.chat


const server = new grpc.Server()

server.addService(chatPackage.Chat.service, {
  GetMessages,
  SendMessage,
  UpdateMessage,
  DeleteMessage,
  ReceiveMessages
})


server.bindAsync(SERVER_URI, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`Your server as started on port ${port}`)
    // server.start()
});