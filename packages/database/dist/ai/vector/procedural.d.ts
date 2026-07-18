import { DiscordGuildTemplate } from './generator';
import { Vector16D } from './math';
export declare class ProceduralBuilder {
    /**
     * Generates a dynamic server blueprint based on the 16D vector score
     */
    static buildFromVector(vector: Vector16D): DiscordGuildTemplate;
}
