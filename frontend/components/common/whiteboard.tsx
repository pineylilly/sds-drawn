"use client";

import dynamic from "next/dynamic";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { BinaryFileData, BinaryFiles, ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { act, useEffect, useRef, useState } from "react";
import { set } from "react-hook-form";
import { boolean } from "zod";
import { useParams } from "next/navigation";
import { streamingFetch, streamingLongResponseFetching } from "@/lib/streaming";
import { User } from "@/types/User";
//import { Excalidraw } from "@excalidraw/excalidraw";
const Excalidraw = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Excalidraw,
    {
        ssr : false
    }
);

export type ExcalidrawRespnse = {
    action: string;
    data: string;
}

type ExcalidrawAction = {
    action: string;
    data: ExcalidrawElement[] | BinaryFileData;
}

export default function Whiteboard({viewMode,setUsers} : {viewMode: boolean, setUsers: (userList: User[]) => void}) {

    const params = useParams<{ id: string }>();
    const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();
    const clientElement = useRef<ExcalidrawElement[]>([]);
    const previousFiles = useRef<BinaryFiles>({});
    
    const isReceived = useRef<boolean>(false);
    function updateElements(elements: readonly ExcalidrawElement[]) {
        const cloneElements = elements.map((element) => ({...element}));
        clientElement.current = cloneElements;
        //isUpdate.current = true;
    }

    function addPreviousFiles(newFile: BinaryFileData) {
        previousFiles.current = {...previousFiles.current, [newFile.id] : newFile};
    }

    async function joinCollaborative() {
        for await (let chunk of streamingLongResponseFetching(() => fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/collab/" + params.id + "/join", {
            method: 'POST',
            credentials: 'include',
        }))) {
            const allResponse = chunk.split("}{");
            for (let i = 0; i < allResponse.length; i++) {
                if (!allResponse[i].startsWith("{")) {
                    allResponse[i] = "{" + allResponse[i];
                }
                if (!allResponse[i].endsWith("}")) {
                    allResponse[i] = allResponse[i] + "}";
                }
            }
            for (let res of allResponse) {
                try {
                    const data : ExcalidrawRespnse = JSON.parse(res);
                    const avaliableAction = new Set(["ADD_ELEMENT", "UPDATE_ELEMENT", "DELETE_ELEMENT","ADD_IMAGE"]);
                    if (avaliableAction.has(data.action)) {
                        const action: ExcalidrawAction = {
                            action: data.action,
                            data: JSON.parse(data.data)
                        };
                        excuteAction(action);
                    } else if (data.action === "UPDATE_CONNECTION"){
                        const userIdList: string[] = JSON.parse(data.data);
                        const userList: User[] = await Promise.all(userIdList.map(async (userId) => {
                            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/users/" + userId, {
                                method: 'GET',
                                credentials: 'include',
                            });
                            if (response.ok) {
                                const data = await response.json();
                                return data;
                            }
                            return null;
                        }));
                        // sort by display name
                        
                        userList.sort((a, b) => {
                            if (a.displayName < b.displayName) {
                                return -1;
                            }
                            if (a.displayName > b.displayName) {
                                return 1;
                            }
                            return 0;
                        });
                         
                        setUsers(userList);
                        console.log(`User list: ${userIdList}`);
                    } 
                    else{
                        console.log(data.action);
                        console.log("Invalid action");
                    }
                } catch (error) {
                    console.log(error);
                    console.log(res);
                    console.log(chunk);
                }
            }
            // try {
            //     const data : ExcalidrawRespnse = JSON.parse(chunk);
            //     const avaliableAction = ["ADD_ELEMENT", "UPDATE_ELEMENT", "DELETE_ELEMENT"];
            //     if (avaliableAction.includes(data.action)) {
            //         const action: ExcalidrawAction = {
            //             action: data.action,
            //             data: JSON.parse(data.data)
            //         };
            //         isReceived.current = true;
            //         excuteAction(action);
            //     } else{
            //         console.log("Invalid action");
            //     }
            // } catch (error) {
            //     console.log(error);
            //     console.log(chunk);
            // }
       
        }
    }

    async function InitializeWhiteBoard(){
        // fetch data from server
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/collab/" + params.id + "/drawing", {
            method : "GET",
            credentials : 'include',
        })
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            const elements = JSON.parse(data.data) as ExcalidrawElement[];
            const imageData = JSON.parse(data.imageData) as BinaryFileData[];
            if (excalidrawAPI){
                updateElements(elements);
                excalidrawAPI.updateScene({
                    elements: elements
                });
                let newPreviousFiles = {...previousFiles.current};
                for (let image of imageData) {
                    if (image.id in newPreviousFiles) {
                        continue;
                    }
                    newPreviousFiles[image.id] = image;
                }
                previousFiles.current = newPreviousFiles;
                excalidrawAPI.addFiles(imageData);
                
            }
        } else {
            console.log("Failed to fetch data");
        }
    }

    function excuteAction(action: ExcalidrawAction) {
        if (excalidrawAPI) {
            switch (action.action) {
                case "ADD_ELEMENT":
                    const updateData = [...excalidrawAPI.getSceneElements(), ...action.data as ExcalidrawElement[]];
                    updateElements(updateData);
                    excalidrawAPI.updateScene({
                        elements: updateData
                    });
                    console.log("Add element");
                    break;
                case "DELETE_ELEMENT":
                    console.log("Delete element");
                case "UPDATE_ELEMENT":
                    const updateDataElement = action.data as ExcalidrawElement[];
                    const elements: ExcalidrawElement[] = [...excalidrawAPI.getSceneElements()];
                    const indices = [];
                    const searchID = new Set<String>();
                    for (let element of updateDataElement){
                        searchID.add(element.id);
                    }
                    for (let i = 0; i < elements.length; i++) {
                        if (searchID.has(elements[i].id)) {
                            indices.push(i);
                        }
                    }
                    for (let i = 0; i < indices.length; i++) {
                        elements[indices[i]] = updateDataElement[i];
                    }
                    // const index = elements.findIndex((element) => element.id === action.data.id);
                    // elements[index] = action.data;
                    // console.log(action.data);
                    // console.log(elements);
                    updateElements(elements);
                    excalidrawAPI.updateScene({
                        elements: elements
                    });
                    break;
                
                case "ADD_IMAGE":
                    const file = action.data as BinaryFileData;
                    if (excalidrawAPI){
                        addPreviousFiles(file);
                        excalidrawAPI.addFiles([file]);
                    }
                    break;
                default:
                    console.log("Invalid action");
                    console.log(action);
                    break;
            }
        }
    }

    function getAction(previousElements: readonly ExcalidrawElement[], currentElements: readonly ExcalidrawElement[]) : ExcalidrawAction | null {
        if (previousElements.length < currentElements.length) {
            // can have multiple add element
            const previousId = new Set<String>(previousElements.map(element => element.id));
            const addedElements = currentElements.filter(element => !previousId.has(element.id));
            return {
                action : "ADD_ELEMENT",
                data : addedElements,
            }
        } else {

            // find deleted element can have multiple delete element
            // const deleteElement = currentElements.find((element, index) => {
            //     return element.id === previousElements[index].id && element.isDeleted && !previousElements[index].isDeleted;
            // });
            // if (deleteElement) {
            //     return {
            //         action : "DELETE_ELEMENT",
            //         data : deleteElement
            //     }
            // }
            const deleteElements = currentElements.filter((element, index) => {
                return element.id === previousElements[index].id && element.isDeleted && !previousElements[index].isDeleted;
            });
            if (deleteElements.length > 0) {
                return {
                    action : "DELETE_ELEMENT",
                    data : deleteElements
                }
            }                
            // find updated element
            // const updateElement = currentElements.find((element, index) => {
            //     return element.id === previousElements[index].id && element.updated !== previousElements[index].updated;
            // });
            // if (updateElement) 
            //     return {
            //         action : "UPDATE_ELEMENT",
            //         data : updateElement,
            //     }
            const updateElements = currentElements.filter((element, index) => {
                return element.id === previousElements[index].id && element.updated !== previousElements[index].updated;
            });
            if (updateElements.length > 0) {
                return {
                    action : "UPDATE_ELEMENT",
                    data : updateElements,
                }
            }
            return null;
        }

    }

    async function sendUpdateToServer(action: ExcalidrawAction) {
        // send data to server
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/collab/" + params.id + "/drawing", {
                method : "POST",
                credentials : 'include',
                body : JSON.stringify({
                    action : action.action,
                    data : JSON.stringify(action.data),
                }),
    
            });
            if (response.ok) {
                console.log("Successfully updated");
            } else {
                console.log("Failed to update");
            }
           // console.log(`Send data ${JSON.stringify(clientElement.current)}to Server`);
        } catch (error) {
            console.log(error);
        }
        
    }

    function isUploadNewFile(previousFiles : BinaryFiles, currentFiles : BinaryFiles) : boolean {
        return Object.keys(previousFiles).length < Object.keys(currentFiles).length;
    }

    function isSameElement(elementArr1: readonly ExcalidrawElement[], elementArr2: readonly ExcalidrawElement[]): boolean {
        // this method compare two element array and return true if they are same to prevent unnecessary sending data to server by compare update time
        
        if (elementArr1.length !== elementArr2.length) return false;
        return elementArr1.every((element, index) => { 
            return element.id === elementArr2[index].id && element.updated === elementArr2[index].updated;
        });
    }

    async function uploadFile(file: BinaryFileData) {
        console.log(file);
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/collab/" + params.id + "/image", {
            method : "POST",
            credentials : 'include',
            body : JSON.stringify({
                fileID : file.id,
                fileMimeType : file.mimeType,
                fileData : JSON.stringify(file),
            }),
        });
        if (response.ok) {
            console.log("Successfully uploaded file");
        } else {
            console.log("Failed to upload file");
        }
    }

    useEffect(() => {
        if (excalidrawAPI) {
            joinCollaborative();
            // excalidrawAPI.onPointerUp(() => {
            //     if (isUpdate.current) {
            //         sendUpdateToServer();
            //     }
            // });
            InitializeWhiteBoard(); //
        }
    },[excalidrawAPI]);
    return (
        <div className="w-full h-full">
            <Excalidraw 
                excalidrawAPI={(api) => setExcalidrawAPI(api)}
                 viewModeEnabled={viewMode}
                 onChange={(excalidrawElements, appState, files) => {
                     if (!isSameElement(excalidrawElements, clientElement.current) && !appState.draggingElement) {
                        const excalidrawAction = getAction(clientElement.current, excalidrawElements);
                        if (excalidrawAction && !isReceived.current) {
                            updateElements(excalidrawElements);
                            sendUpdateToServer(excalidrawAction);
                        } else {
                            isReceived.current = false;
                        }
                        //console.log("update"); 
                    }
                    if (isUploadNewFile(previousFiles.current,files)){
                        const searchFile = new Set(Object.keys(previousFiles.current));
                        for (const file of Object.values(files)) {
                            if (!searchFile.has(file.id)) {
                                uploadFile(file);
                                previousFiles.current = {...previousFiles.current, [file.id] : file};
                            }
                        }
                    
                    }
                   
                    // debouning
                    
                    
                    //console.log(appState.cursorButton); 
                     //console.log(files);
                 }}    
            />
        </div>
    )
}