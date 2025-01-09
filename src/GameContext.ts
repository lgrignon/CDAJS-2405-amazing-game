import { createContext } from "react";
import { GameState } from "./services/GameStateService";

export interface GameContextType {
    gameState: GameState;
}

export const GameContext = createContext<GameContextType>({ gameState: {} });