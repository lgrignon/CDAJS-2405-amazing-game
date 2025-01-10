import { GameItem, GameItemType, GameState, GameStateService } from "./GameStateService";

const BACK_URL = "http://localhost:4000";
const LOCAL_STORAGE_KEY_CLIENT_ID = "__amazing_clientId";
export class BackendGameStateService extends GameStateService {

    clientId?: string;

    protected async doPersistGameState(): Promise<void> {
        let queryString = ''
        if (this.clientId) {
            queryString = '?clientId=' + this.clientId;
        }
        const response = await fetch(BACK_URL + '/gameState/save' + queryString, {
            method: 'POST',
            body: JSON.stringify(this.currentGameState),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status != 200) {
            throw new Error('error saving game');
        }
        const responseText: string = await response.text();
        console.log(responseText);
        this.clientId = responseText;
        localStorage.setItem(LOCAL_STORAGE_KEY_CLIENT_ID, responseText)
    }

    protected async doLoadGameState(): Promise<GameState | undefined> {
        if (!this.clientId) {
            const savedId = localStorage.getItem(LOCAL_STORAGE_KEY_CLIENT_ID);
            if (savedId && savedId != "") {
                this.clientId = savedId;
            }
        }
        if (this.clientId) {
            const response = await fetch(BACK_URL + '/gameState/get?clientId=' + this.clientId, {
                method: 'GET'
            });
            if (response.status == 404) {
                return undefined;
            }
            if (response.status != 200) {
                throw new Error('error getting game state');
            }
            const gameState = await response.json();
            console.log('game state from back', gameState)
            return gameState;
        }
        return undefined;
    }
}
