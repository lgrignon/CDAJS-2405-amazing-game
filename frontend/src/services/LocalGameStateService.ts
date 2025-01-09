import { GameLevel, GameState, GameStateService } from "./";

const LOCAL_STORAGE_KEY = "__amazing_gameState";
export class LocalGameStateService extends GameStateService {

    protected async doPersistGameState(): Promise<void> {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.currentGameState));
    }

    protected async doLoadGameState(): Promise<GameState | undefined> {
        const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedState && savedState != "") {
            return JSON.parse(savedState);
        }
        return undefined;
    }
}
