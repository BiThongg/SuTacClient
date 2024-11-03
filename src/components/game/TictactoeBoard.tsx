import Btn from "@components/shared/Btn";
import IconX from "@assets/icon-x.svg";
import IconO from "@assets/icon-o.svg";
import { Cell } from "@app/Utils";

export default function TicTacToeBoard({
  board,
  onMove,
}: {
  board: Cell[][];
  onMove: (point: { x: number; y: number }) => void;
}) {
  return (
    <section className="grid grid-cols-3 gap-5 w-[500px] min-w-[500px] mx-auto mb-10  overflow-auto">
      {board.map((row, i) =>
        row.map((col, j) => (
          <div
            key={j}
            className="pb-2 bg-black-500 w-full h-[99px] min-w-[100px] rounded-md"
          >
            <Btn
              classCSS="bg-black-300 rounded-md py-6 h-full w-full "
              onClick={() => onMove({ x: j, y: i })}
            >
              <img
                src={
                  col === Cell.X ? IconX : col === Cell.O ? IconO : undefined
                }
                alt=""
                className="w-11 mx-auto"
              />
            </Btn>
          </div>
        )),
      )}
    </section>
  );
}
