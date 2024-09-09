import Btn from "@components/shared/Btn";
import { GridGame, ticTacToeBoard } from "@helpers/gridGame";
import Game from "src/app/game/Game";
import IconX from "@assets/icon-x.svg";
import IconO from "@assets/icon-o.svg";
import { SumokuGame } from "@app/game/SumokuGame";
import { TicTacToeGame } from "@app/game/TicTacToeGame";
import { Cell } from "@app/Utils";

function Grid({
  ticTacToe,
  handleTicTacToe,
}: {
  ticTacToe: GridGame[][];
  handleTicTacToe: (id: number) => void;
}) {

  const classNameOfSectionTag = `grid grid-cols-${ticTacToe.length} gap-5 w-[90%] mx-auto mb-10`
  const sumokuGame: Game = new SumokuGame();
  const tictactoeGame: Game = new TicTacToeGame();
  console.log(tictactoeGame.board)

  return tictactoeGame.board.length === 3 ? (
    <section className={classNameOfSectionTag}>
      {tictactoeGame.board.map((row, i) =>
        row.map((col, j) => (
          <div
            key={j}
            className="pb-2 bg-black-500 w-full h-[99px] rounded-md"
          // data-value={value}
          >
            <Btn
              // onClick={() => !icon && handleTicTacToe(id)}
              // classCSS={`${isWinner === "X"
              //   ? "bg-blue-400"
              //   : isWinner === "O"
              //     ? "bg-yellow-400"
              //     : "bg-black-300"
              //   } rounded-md py-6 h-full w-full`}
              classCSS="bg-black-300 rounded-md py-6 h-full w-full"
            >
              <img src={
                col === Cell.X ? IconX : col === Cell.O ? IconO : undefined
              } alt="" className="w-11 mx-auto" />
            </Btn>
          </div>
        ))
      )}
    </section>

  ) : (
    <section>
      <table className="table-auto border-collapse w-full">
        <tbody>
          {sumokuGame.board.map((row, i) => (
            <tr key={i}>
              {row.map((col, j) => (
                <td
                  key={j}
                  className="border bg-black-500 w-[40px] h-[40px] rounded-md"
                  data-value={col.valueOf()}
                >
                  <Btn
                    onClick={() => { }}
                    classCSS={'align-middle w-full'}
                  >
                    <img src={
                      col === Cell.X ? IconX : col === Cell.O ? IconO : undefined
                    } alt="" className="w-6 mx-auto" />
                  </Btn>
                </td>
              ))}
            </tr>
          ))}
          <br />

        </tbody>
      </table>
    </section>
  );
}

export default Grid;
