import { GameState, GameStateService } from "./GameStateService";

export class BackendGameStateService extends GameStateService {

    protected async doPersistGameState(): Promise<void> {
        // TODO
    }

    protected async doLoadGameState(): Promise<GameState | undefined> {
        // TODO
        return undefined;
    }
}
