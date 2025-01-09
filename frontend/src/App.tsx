import 'mini.css/dist/mini-dark.min.css';
import './App.css'
import { Welcome } from './Welcome'
import { useEffect, useState } from 'react';
import { GameContext } from './GameContext';
import { GameState } from './services/GameStateService';
import { GameWorld } from './GameWorld';
import { getGameStateService, LocalGameStateService } from './services';

const gameStateService = new LocalGameStateService();
function App() {

  const [gameState, setGameState] = useState<GameState>(getGameStateService().getGameState());

  async function init() {
    getGameStateService().onGameStateModified(gameState => setGameState({...gameState}));
    await gameStateService.loadGameState();
  }
  useEffect(() => {
    init();
  }, []);

  function startOver() {
    getGameStateService().startOver();
  }

  let view = <label>You are lost!</label>;
  if (!gameState.level || !gameState.userName) {
    view = <Welcome />
  } else {
    view = <GameWorld />
  }

  return (
    <GameContext.Provider value={{ gameState }}>
      <h1>
        <img src="/monster1.png" className="logo" alt="Monster logo" />
        Amazing game
      </h1>
      {view}

      <section aria-label="footer actions">
        <button onClick={startOver}>🔄</button>
      </section>
    </GameContext.Provider>
  )
}

export default App
