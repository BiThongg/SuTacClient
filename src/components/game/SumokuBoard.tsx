import Btn from "@components/shared/Btn";
import IconX from "@assets/icon-x.svg";
import IconO from "@assets/icon-o.svg";
import { Cell } from "@app/Utils";

export default function SumokuBoard({
  board
}: {
  board: Cell[][];
}) {

  return (
    <section>
      <table className="table-auto border-collapse w-full">
        <tbody>
          {board.map((row, i) => (
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

