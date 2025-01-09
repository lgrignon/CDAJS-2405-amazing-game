import { useRef } from "react"
import { GameLevel } from "./services/GameStateService";
import { getGameStateService } from "./services";

export function Welcome() {

    const nameRef = useRef<HTMLInputElement>(null);
    const levelRef = useRef<HTMLSelectElement>(null);

    const onSubmit = () => {
        const name: string = nameRef.current?.value ?? "";
        const level: GameLevel = levelRef.current?.value as GameLevel ?? GameLevel.HARDCORE;
        getGameStateService().startGame(name, level);
    }

    return <form aria-label="welcome form">
        <label htmlFor="username">Your name</label>
        <input type="text" id="username" aria-label="username" ref={nameRef} />


        <label htmlFor="level">Game level</label>
        <select id="level" aria-label="game level" ref={levelRef}>
            {Object.values(GameLevel).map(level => <option key={level}>{level}</option>)}
        </select>

        <button type="button" aria-label="start button" onClick={onSubmit}>Launch</button>

    </form>
}