import IconX from "@assets/icon-x.svg";
import IconO from "@assets/icon-o.svg";
import { Cell } from "@app/Utils";

export default function SumokuBoard({
  board,
  onMove
}: {
  board: Cell[][];
  onMove: (point: { x: number, y: number }) => void;
}) {

  return (
    <table className="table-auto border-collapse w-full sm:translate-y-9 md:translate-y-12 lg:translate-y-[4rem]">
      <tbody>
        {board.map((row, i) => (
          <tr key={i}>
            {row.map((col, j) => (
              <td
                key={j}
                className="border bg-black-500 rounded-md cursor-pointer h-10 lg:py-[0.4rem] p-1"
                onClick={() => {
                  onMove({ x: j, y: i });
                }}>
                <img src={
                  col === Cell.X ? IconX : col === Cell.O ? IconO : undefined
                } alt="" className="w-8 mx-auto" />
              </td>
            ))}
          </tr>
        ))}
        <br />
      </tbody>
    </table>
  );
}

