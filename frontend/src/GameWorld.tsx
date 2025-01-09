import { useContext, useEffect, useRef, useState } from "react";
import { GameContext } from "./GameContext";
import { GAME_WORLD_DIMENSIONS, GameItem, GameItemType, getGameStateService } from "./services";

interface GameCanvasInfos {
  offsetLeft: number, width: number, height: number
}

function GameWorldItem({ item, canvasInfos }: { item: GameItem, canvasInfos: GameCanvasInfos }) {
  let imageFilename = "rock.png";
  if (item.revealed) {
    switch (item.type) {
      case GameItemType.BOMB:
        imageFilename = "bomb.png";
        break;
      case GameItemType.MONSTER1:
        imageFilename = "monster1.png";
        break;
      case GameItemType.MONSTER2:
        imageFilename = "monster2.png";
        break;
      case GameItemType.EMPTY:
        imageFilename = "crater.png";
        break;
      case GameItemType.GOLD:
        imageFilename = "gold.png";
        break;
    }
  }

  return <img aria-label={item.revealed ? "item " + item.type : "item to be discovered"}
    style={{
      left: canvasInfos.offsetLeft + (item.position.left / GAME_WORLD_DIMENSIONS.width) * canvasInfos.width,
      top: (item.position.top / GAME_WORLD_DIMENSIONS.height) * canvasInfos.height,
    }}
    onClick={(event) => {
      if (item.revealed) {
        return;
      }
      const img = event.currentTarget;
      img.src = "/smoke.gif";
      img.classList.add('revealing');
      setTimeout(() => {
        img.classList.remove('revealing');
        getGameStateService().revealItem(item.id);
      }, 1000);
    }}
    className={"item " + (item.revealed ? 'revealed' : '')} src={"/" + imageFilename} />
}

export function GameWorld() {

  const context = useContext(GameContext);
  const worldContainerRef = useRef<HTMLElement>(null);
  const worldImageRef = useRef<HTMLImageElement>(null);

  const [worldImageLoaded, setWorldImageLoaded] = useState<boolean>(false);
  const [canvasInfos, setCanvasInfos] = useState<GameCanvasInfos>();

  function refreshCanvasInfos() {
    if (worldContainerRef.current && worldImageRef.current) {
      setCanvasInfos({
        offsetLeft: (worldContainerRef.current!.clientWidth - worldImageRef.current.clientWidth) / 2,
        width: worldImageRef.current.clientWidth,
        height: worldImageRef.current.clientHeight,
      });
    }
  }

  useEffect(() => {
    window.addEventListener('resize', refreshCanvasInfos, false);
    refreshCanvasInfos();
    return () => window.removeEventListener("resize", refreshCanvasInfos);
  }, [worldImageLoaded])

  if (!context.gameState.items || context.gameState.items.length == 0) {
    getGameStateService().initRandomGameItems();
    return <></>
  }

  let body = <label aria-label="game over">Game over</label>
  if (context.gameState.healthPercent! > 0) {
    body = <section aria-label="game world" ref={worldContainerRef} key={'world section'}>

      <img src='/worldBackground.jpg' ref={worldImageRef} onLoad={() => setWorldImageLoaded(true)} key={'world bg'} />

      {canvasInfos && context.gameState.items && context.gameState.items.map(item => (
        <GameWorldItem key={"item" + item.id} item={item} canvasInfos={canvasInfos}>
        </GameWorldItem>
      ))}

    </section>
  }

  return (
    <>
      <header aria-label="game state header">
        <label>🪪 Player :</label> {context.gameState.userName}
        &nbsp;┃
        <label>🧑‍🎓 Level :</label> {context.gameState.level}
        &nbsp;┃
        <label>💉 Health :</label> {context.gameState.healthPercent} %
        &nbsp;┃
        <label>🪙 Coins :</label> {context.gameState.coins}
      </header>

      {body}
    </>
  );
}
