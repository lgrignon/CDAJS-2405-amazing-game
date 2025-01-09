import { LocalGameStateService } from '.';
import { GameStateService } from '.';

export * from './GameStateService'
export * from './LocalGameStateService'
export * from './BackendGameStateService'


const defaultInstance = new LocalGameStateService();

export function getGameStateService(): GameStateService {
    return defaultInstance;
}