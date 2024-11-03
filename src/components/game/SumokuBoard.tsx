import IconX from "@assets/icon-x.svg";
import IconO from "@assets/icon-o.svg";
import { Cell } from "@app/Utils";

export default function SumokuBoard({
  board,
  onMove,
}: {
  board: Cell[][];
  onMove: (point: { x: number; y: number }) => void;
}) {
  return (
    <table className="w-[700px] table-fixed border-collapse mx-auto">
      <tbody>
        {board.map((row, i) => (
          <tr
            key={i}
            className="h-[50px] min-h-[50px] max-h-[50px] w-[50px] min-w-[50px] max-w-[50px]"
          >
            {row.map((col, j) => (
              <td
                key={j}
                className="border bg-black-500 rounded-md cursor-pointer h-[50px] min-h-[50px] max-h-[50px] w-[50px] min-w-[50px] max-w-[50px] lg:py-[0.4rem] p-1"
                onClick={() => {
                  onMove({ x: j, y: i });
                }}
              >
                <img
                  src={
                    col === Cell.X ? IconX : col === Cell.O ? IconO : undefined
                  }
                  alt=""
                  className="w-8 mx-auto"
                />
              </td>
            ))}
          </tr>
        ))}
        <br />
      </tbody>
    </table>
  );
}
