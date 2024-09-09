import { useContext, useEffect, useState } from "react";
import { useTurn } from "./useTurn";
import { useScore } from "./useScore";
import { useWin } from "./useWin";
import { ticTacToeBoard } from "@helpers/gridGame";

import IconO from "@assets/icon-o.svg";
import IconX from "@assets/icon-x.svg";
import { ModalContext } from "@context/ContextModal";

export function useTicTacToe() {
  const { modal, setModal } = useContext(ModalContext);

  const [isContinueGame, setIsContinueGame] = useState(true);

  const [ticTacToe, setTicTacToe] = useState(ticTacToeBoard);

  const [isTurnX, handleTurn] = useTurn();

  const [typeGame, pickPlayer, score, setScore] = useScore();

  const { checkWinner } = useWin();

  const handleTicTacToe = (id: number) => {
    const newTicTacToe = ticTacToe.map((item) => {
      item.map((subItem) => {
        if (subItem.id === id) {
          subItem.value = isTurnX ? "X" : "O";
          subItem.icon = isTurnX ? IconX : IconO;
        }
        return subItem;
      }
      );
      return item;
    }
    );


    setTicTacToe(newTicTacToe);
    handleTurn(!isTurnX);
  };

  const handleCpu = () => {
    // const emptyValues = ticTacToe.filter((item) => !item.value);
    //
    // if (emptyValues.length > 0) {
    //   if (pickPlayer === "O" && !isTurnX) return;
    //
    //   if (pickPlayer === "X" && isTurnX) return;
    //
    //   const numberRandom = Math.random() * emptyValues.length;
    //
    //   const random = Math.floor(numberRandom);
    //   const id = emptyValues[random].id;
    //   handleTicTacToe(id);
    // }
  };

  useEffect(() => {
    // let playerWin = checkWinner(isTurnX ? "X" : "O", {
    //   ticTacToe,
    //   pickPlayer,
    //   typeGame,
    //   setScore,
    //   score,
    //   setTicTacToe,
  });

  //   if (playerWin) {
  //     setIsContinueGame(false);
  //     return;
  //   }
  //
  //   if (typeGame === "cpu" && isContinueGame) {
  //     handleCpu();
  //   }
  // }, [isTurnX, isContinueGame]);

  useEffect(() => {
    if (modal.isNextRound) {
      setTicTacToe(ticTacToeBoard);

      setIsContinueGame(true);
      handleTurn(true);

      setModal({
        ...modal,
        isNextRound: false,
      });
    }
  }, [modal.isNextRound]);

  return {
    // state
    ticTacToe,
    isTurnX,
    typeGame,
    pickPlayer,
    score,
    // methods
    handleTicTacToe,
    setScore,
  };
}
