export interface GridGame {
  id: number;
  value: string;
  icon: string;
  isWinner: string;
}

// init gridGma ewith 15x15 grid with stream
// build the 2 dimentional array with 15x15 grid or 3x3 grid
//

export const ticTacToeBoard: GridGame[][] = Array.from(
  { length: 3 },
  (_, i) => {
    return Array.from({ length: 3 }, (_, j) => {
      return {
        id: i + 300 * j,
        value: "",
        icon: "",
        isWinner: "",
      };
    });
  },
);

export const sumokuBoard: GridGame[][] = Array.from({ length: 15 }, (_, i) => {
  return Array.from({ length: 15 }, (_, j) => {
    return {
      id: i + j,
      value: "",
      icon: "",
      isWinner: "",
    };
  });
});

//   {
//   id: i,
//   value: "",
//   icon: "",
//   isWinner: "",
// }
//   {
//     id: 1,
//     value: "",
//     icon: "",
//     isWinner: "",
//   },
//   {
//     id: 2,
//     value: "",
//     icon: "",
//     isWinner: "",
//   },
//   {
//     id: 3,
//     value: "",
//     icon: "",
//     isWinner: "",
//   },
//   {
//     id: 4,
//     value: "",
//     icon: "",
//     isWinner: "",
//   },
//
//   {
//     id: 5,
//     value: "",
//     icon: "",
//     isWinner: "",
//   },
//   {
//     id: 6,
//     value: "",
//     icon: "",
//     isWinner: "",
//   },
//   {
//     id: 7,
//     value: "",
//     icon: "",
//     isWinner: "",
//   },
//   {
//     id: 8,
//     value: "",
//     icon: "",
//     isWinner: "",
//   },
//   {
//     id: 9,
//     value: "",
//     icon: "",
//     isWinner: "",
//   },
// ];
