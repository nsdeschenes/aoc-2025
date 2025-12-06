async function solvePartOne(filename: string) {
  const input = await Bun.file(filename).text();
  const lines = input.split("\n");

  const data: Array<Array<number>> = [];
  const operators: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const matches = lines[i]?.match(/\S+/g);
    if (!matches) continue;

    if (!Array.isArray(data?.[i])) {
      data[i] = [];
    }

    for (let j = 0; j < matches.length; j++) {
      if (!data[j]) {
        data[j] = [];
      }
      if (i === lines.length - 1) {
        operators.push(matches[j]!);
      } else {
        data[j]?.push(parseInt(matches[j]!));
      }
    }
  }

  const total = data
    ?.map((value, index) =>
      value.reduce((acc, curr) => {
        if (operators[index] === "+") {
          return (acc += curr);
        } else if (operators[index] === "*") {
          return (acc *= curr);
        }
        return acc;
      })
    )
    .reduce((acc, curr) => (acc += curr));
  console.log("Part one:", total);
}

async function solvePartTwo(filename: string) {
  const input = await Bun.file(filename).text();
  let lines = input.split("\n");

  const columnWidths = new Map<number, number>();
  for (let i = 0; i < lines.length - 1; i++) {
    const matches = lines[i]?.match(/\S+/g);
    if (!matches) continue;

    for (let column = 0; column < matches.length; column++) {
      const currDigit = matches[column];
      if (!currDigit) continue;

      columnWidths.set(
        column,
        Math.max(columnWidths.get(column) ?? 0, currDigit.length)
      );
    }
  }

  const data: Array<Array<string>> = [];
  for (let i = 0; i < lines.length; i++) {
    data[i] = [];

    let pos = 0;
    for (let col = 0; col < columnWidths.size; col++) {
      const width = columnWidths.get(col)!;
      data[i]?.push(lines[i]?.slice(pos, pos + width)!);
      pos += width + 1;
    }
  }

  const operators = data
    .pop()!
    .map((value) => value.trim())
    .toReversed();

  const sortedData = data[0]!.map((_, i) => data?.map((row) => row[i]!))!;

  const reversedData = sortedData.toReversed().map((value) => {
    const rtrArr: string[] = [];

    for (let row = 0; row < value.length; row++) {
      for (let col = 0; col < value.length; col++) {
        if (!value?.[col]?.split("")[row]) continue;

        if (!rtrArr[row]) {
          rtrArr.push(value[col]!.split("")[row]!);
        } else {
          rtrArr[row] = `${rtrArr[row]}${value[col]!.split("")[row]}`;
        }
      }
    }

    return rtrArr.map((value) => parseInt(value.trim()));
  });

  const total = reversedData
    ?.map((value, index) =>
      value.reduce((acc, curr) => {
        if (operators[index] === "+") {
          return (acc += curr);
        } else if (operators[index] === "*") {
          return (acc *= curr);
        }
        return acc;
      })
    )
    .reduce((acc, curr) => (acc += curr));
  console.log("Part two:", total);
}

await solvePartOne("puzzle-input");
await solvePartTwo("puzzle-input");
