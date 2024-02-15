import { IsString } from "class-validator";


export class ProsCosDiscusserDto{
    
    @IsString()
    readonly prompt: string;
}