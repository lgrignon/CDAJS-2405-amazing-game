import { useContext } from "react";
import { GameContext } from "./GameContext";
import { GameItem, GameItemType, getGameStateService } from "./services";

function GameWorldItem({ item }: { item: GameItem }) {
  let imageFilename = "rock.png";
  switch (item.type) {
    case GameItemType.BOMB:
      imageFilename = "bomb.png";
      break;
    case GameItemType.MONSTER:
      imageFilename = Math.random() > .5 ? "monster1.png" : "monster2.png";
      break;
    case GameItemType.EMPTY:
      imageFilename = "emptyItem.png";
      break;
    case GameItemType.GOLD:
      imageFilename = "gold.png";
      break;
  }

  return <img src={"/" + imageFilename} />
}

export function GameWorld() {

  const context = useContext(GameContext);

  if (!context.gameState.items || context.gameState.items.length == 0) {
    getGameStateService().initRandomGameItems();
  }

  return (
    <section>
      <header>
        <label>Player :</label> {context.gameState.userName}
        ┃
        <label>Level :</label> {context.gameState.level}
      </header>

      <section>

        {context.gameState.items && context.gameState.items.map(item => <GameWorldItem item={item}></GameWorldItem>)}

      </section>
    </section>
  );
}
