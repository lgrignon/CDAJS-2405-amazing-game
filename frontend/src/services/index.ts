import { GameStateService } from '.';
import { BackendGameStateService } from '.';
import { LocalGameStateService } from '.';

export * from './GameStateService'
export * from './LocalGameStateService'
export * from './BackendGameStateService'


const defaultInstance = new BackendGameStateService();

export function getGameStateService(): GameStateService {
    return defaultInstance;
}