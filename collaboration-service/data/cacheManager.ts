import { db } from "../utils/db";
import redisClient from "../utils/db_redis";

class CacheManager{
    private static instance: CacheManager;
    private cache = redisClient;

    private constructor(){}

    public static getInstance(): CacheManager{
        if(!CacheManager.instance){
            CacheManager.instance = new CacheManager();
        }
        return CacheManager.instance;
    }

    private async has(key: string): Promise<boolean>{
        const result = await this.cache.exists(key);
        return result === 1;
    }

    public async hasDrawingState(workspaceId: number): Promise<boolean>{
        return await this.has(`drawingState:${workspaceId}`);
    }

    public async hasImageState(workspaceId: number): Promise<boolean>{
        return await this.has(`imageState:${workspaceId}`);
    }

    public async pushDrawingState(workspaceId: number, data: any){
        await this.cache.set(`isDirty:drawingState:${workspaceId}`, 'true');
        return await this.cache.rPush(`drawingState:${workspaceId}`, JSON.stringify(data));
    }

    public async pushImageState(workspaceId: number, data: any){
        await this.cache.set(`isDirty:imageState:${workspaceId}`, 'true');
        return await this.cache.rPush(`imageState:${workspaceId}`, JSON.stringify(data));
    }

    public async getDrawingState(workspaceId: number): Promise<any[]>{
        if(!await this.hasDrawingState(workspaceId)){
            // fetch from database
            const databaseResult = await db.board.findUnique({
                where: {
                    workspaceId: workspaceId
                },
                select: {
                    drawingState: true
                }
            })
            if (databaseResult && databaseResult.drawingState.length > 0){
                await this.cache.rPush(`drawingState:${workspaceId}`, databaseResult.drawingState);
            } else {
                return [];
            }
        }
        const result = await this.cache.lRange(`drawingState:${workspaceId}`, 0, -1);
        return result.map((data: string) => JSON.parse(data));
    }

    public async getImageState(workspaceId: number): Promise<any[]>{
        if(!await this.hasImageState(workspaceId)){
            // try to fetch from database
            const databaseResult = await db.board.findUnique({
                where: {
                    workspaceId: workspaceId
                },
                select: {
                    imageState: true
                }
            })
            if (databaseResult && databaseResult.imageState.length > 0){
                await this.cache.rPush(`imageState:${workspaceId}`, databaseResult.imageState);
            } else {
                return [];
            }
        }
        const result = await this.cache.lRange(`imageState:${workspaceId}`, 0, -1);
        return result.map((data: string) => JSON.parse(data));
    }

    public async clearDrawingState(workspaceId: number){
        await this.cache.set(`isDirty:drawingState:${workspaceId}`, 'true');
        return await this.cache.del(`drawingState:${workspaceId}`);
    }

    public async clearImageState(workspaceId: number){
        await this.cache.set(`isDirty:imageState:${workspaceId}`, 'true');
        return await this.cache.del(`imageState:${workspaceId}`);

    }

    public async replaceDrawingState(workspaceId: number, data: any[], index: number){
        // make drawing state is dirty
        await this.cache.set(`isDirty:drawingState:${workspaceId}`, 'true');
        return await redisClient.lSet(`drawingState:${workspaceId}`, index, JSON.stringify(data));
    }

    public async checkDirtyDrawingState(workspaceIds: number[]){
        const promises = workspaceIds.map(async (workspaceId) => {
            if (await this.cache.exists(`isDirty:drawingState:${workspaceId}`) === 1){
                return await this.cache.get(`isDirty:drawingState:${workspaceId}`) === 'true';
            } else {
                return false;
            }
        });
        return await Promise.all(promises);
    }

    public async checkDirtyImageState(workspaceIds: number[]){
        const promises = workspaceIds.map(async (workspaceId) => {
            if (await this.cache.exists(`isDirty:imageState:${workspaceId}`) === 1){
                return await this.cache.get(`isDirty:imageState:${workspaceId}`) === 'true';
            } else {
                return false;
            }
        });
        return await Promise.all(promises);
    }

    public async clearDirtyDrawingState(workspaceId: number){
        return await this.cache.set(`isDirty:drawingState:${workspaceId}`, 'false');
    }

    public async clearDirtyImageState(workspaceId: number){
        return await this.cache.set(`isDirty:imageState:${workspaceId}`, 'false');
    }

    public async getAllDrawingWorkspaceIds(){
        const workspaceIds: number[] = [];
        let cursor = 0;
        do {
            const result = await this.cache.scan(cursor,{
                MATCH: 'drawingState:*',
                COUNT: 100,
            });
            cursor = result.cursor;
            result.keys.forEach((key: string) => {
                const workspaceId = key.split(':')[1];
                workspaceIds.push(parseInt(workspaceId));
            });
        } while (cursor !== 0)
            
        return workspaceIds;
        
    }

    public async getAllImageWorkspaceIds(){
        const workspaceIds: number[] = [];
        let cursor = 0;
        do {
            const result = await this.cache.scan(cursor,{
                MATCH: 'imageState:*',
                COUNT: 100,
            });
            cursor = result.cursor;
            result.keys.forEach((key: string) => {
                const workspaceId = key.split(':')[1];
                workspaceIds.push(parseInt(workspaceId));
            });
        } while (cursor !== 0)

        return workspaceIds;

    }

    

}

const cacheManager = CacheManager.getInstance();
export default cacheManager;