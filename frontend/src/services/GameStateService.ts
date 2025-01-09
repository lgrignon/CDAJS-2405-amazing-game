

export enum GameLevel {
    NOOB = "NOOB",
    MEDIUM = "MEDIUM",
    HARDCORE = "HARDCORE"
}

export enum GameItemType {
    GOLD = "GOLD",
    MONSTER1 = "MONSTER1",
    MONSTER2 = "MONSTER2",
    BOMB = "BOMB",
    EMPTY = "EMPTY"
}

export interface GameItem {
    id: string;
    position: { top: number, left: number };
    type: GameItemType;
    revealed: boolean;
}

export interface GameState {
    userName?: string;
    level?: GameLevel;
    healthPercent?: number;
    coins?: number;
    items?: GameItem[];
}

export const GAME_WORLD_DIMENSIONS = { width: 3000, height: 1686 }
export abstract class GameStateService {

    protected currentGameState: GameState = {};
    private listener?: (gameState: GameState) => void;

    constructor() {
    }

    getGameState(): GameState {
        return this.currentGameState;
    }

    async initRandomGameItems(): Promise<void> {
        const items: GameItem[] = [];
        // min 20 items - max 100 items
        const nbItems = 20 + Math.random() * 80;
        for (let i = 0; i < nbItems; i++) {
            let type: GameItemType = GameItemType.EMPTY;
            // 15% monster 10% mine 30% gold 45% nothing
            if (i < (.55 * nbItems)) {
                if (i > (.25 * nbItems)) {
                    type = GameItemType.GOLD;
                } else if (i > (.15 * nbItems)) {
                    type = GameItemType.BOMB;
                } else {
                    type = Math.random() > .5 ? GameItemType.MONSTER1 : GameItemType.MONSTER2;
                }
            }

            items.push({
                id: i.toString(),
                position: {
                    left: Math.random() * GAME_WORLD_DIMENSIONS.width,
                    top: Math.random() * GAME_WORLD_DIMENSIONS.height,
                },
                type,
                revealed: false,
            });
        }
        this.currentGameState.items = items;
        await this.persistGameState();
    }

    async startGame(name: string, level: GameLevel): Promise<void> {
        this.currentGameState.userName = name;
        this.currentGameState.level = level;
        this.currentGameState.healthPercent = 100;
        this.currentGameState.coins = 0;
        console.log("player name and level saved")
        await this.persistGameState();
    }

    async revealItem(itemId: string): Promise<void> {
        const itemToBeRevealed: GameItem | undefined = this.currentGameState.items?.find(item => item.id == itemId);
        if (itemToBeRevealed) {
            itemToBeRevealed.revealed = true;
            if (itemToBeRevealed.type == GameItemType.GOLD) {
                this.currentGameState.coins!++;
            } else if (itemToBeRevealed.type != GameItemType.EMPTY) {
                // it's bad, it hurts 😭
                let healthLoss = 5;
                if (this.currentGameState.level == GameLevel.NOOB) {
                    healthLoss = 1;
                } else if (this.currentGameState.level == GameLevel.HARDCORE) {
                    healthLoss = 20;
                }
                this.currentGameState.healthPercent = this.currentGameState.healthPercent! - healthLoss;
            }
            await this.persistGameState();
        }
    }

    onGameStateModified(listener: (gameState: GameState) => void): void {
        this.listener = listener;
    }

    async startOver(): Promise<void> {
        this.currentGameState = {};
        await this.persistGameState();
    }

    private async persistGameState(): Promise<void> {
        await this.doPersistGameState();
        if (this.listener) {
            this.listener(this.currentGameState);
        }
    }

    async loadGameState(): Promise<void> {
        console.log("restore game state")
        let loadedGameState: GameState | undefined;
        try {
            loadedGameState = await this.doLoadGameState();
            console.log("game state found: " + (loadedGameState != undefined))
        } catch (e) {
            // corrupted game state, restart fresh ⬇️
        }

        if (!loadedGameState) {
            loadedGameState = {};
        }
        this.currentGameState = loadedGameState;
        if (this.listener) {
            this.listener(this.currentGameState);
        }
    }

    protected abstract doPersistGameState(): Promise<void>;
    protected abstract doLoadGameState(): Promise<GameState | undefined>;
}
