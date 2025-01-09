

export enum GameLevel {
    NOOB = "NOOB",
    MEDIUM = "MEDIUM",
    HARDCORE = "HARDCORE"
}

export enum GameItemType {
    GOLD = "GOLD",
    MONSTER = "MONSTER",
    BOMB = "BOMB",
    EMPTY = "EMPTY"
}

export interface GameItem {
    position: { top: number, left: number };
    type: GameItemType;
    revealed: boolean;
}

export interface GameState {
    userName?: string;
    level?: GameLevel;
    healthPercent?: number;
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
                    type = GameItemType.MONSTER;
                }
            }

            items.push({
                position: {
                    left: Math.random() * GAME_WORLD_DIMENSIONS.width,
                    top: Math.random() * GAME_WORLD_DIMENSIONS.height,
                },
                type,
                revealed: false,
            });
        }
    }

    async startGame(name: string, level: GameLevel): Promise<void> {
        this.currentGameState.userName = name;
        this.currentGameState.level = level;
        this.currentGameState.healthPercent = 100;
        console.log("player name and level saved")
        await this.persistGameState();
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
        try {
            const loadedGameState: GameState | undefined = await this.doLoadGameState();
            if (loadedGameState) {
                this.currentGameState = loadedGameState;
                return;
            }
        } catch (e) {
            // corrupted game state, restart fresh ⬇️
        }

        this.currentGameState = {};
        if (this.listener) {
            this.listener(this.currentGameState);
        }
    }

    protected abstract doPersistGameState(): Promise<void>;
    protected abstract doLoadGameState(): Promise<GameState | undefined>;
}
