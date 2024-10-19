import Btn from "@components/shared/Btn";
import IconX from "@assets/icon-x.svg";
import IconO from "@assets/icon-o.svg";
import { Cell } from "@app/Utils";

export default function TicTacToeBoard({
  board,
  onMove
}: {
  board: Cell[][]
  onMove: (point: { x: number, y: number }) => void
}) {

  return (
    <section className="grid grid-cols-3 gap-5 w-[90%] mx-auto mb-10">
      {board.map((row, i) =>
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
              onClick={() =>
                onMove({ x: j, y: i })
              }
            >
              <img src={
                col === Cell.X ? IconX : col === Cell.O ? IconO : undefined
              } alt="" className="w-11 mx-auto" />
            </Btn>
          </div>
        ))
      )}
    </section>
  )
}

