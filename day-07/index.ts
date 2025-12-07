async function solvePartOne(filename: string) {
  const input = await Bun.file(filename).text();
  const lines = input.split("\n").map((v) => v.split(""));

  let tachyonSplitCount = 0;
  for (let y = 1; y < lines.length; y++) {
    const rowLength = lines[y]?.length ?? 0;
    const splitterPresent = lines[y]?.some((v) => v === "^") ?? false;
    for (let x = 0; x < rowLength; x++) {
      if (splitterPresent) {
        const currentElement = lines?.[y]?.[x];
        const aboveElement = lines?.[y - 1]?.[x];

        if (currentElement === "^" && aboveElement === "|") {
          if (lines?.[y]?.[x - 1] && lines?.[y]?.[x - 1] !== "|") {
            lines[y]![x - 1] = "|";
          }

          if (lines?.[y]?.[x + 1] && lines?.[y]?.[x + 1] !== "|") {
            lines[y]![x + 1] = "|";
          }

          tachyonSplitCount += 1;
        }
      }

      const aboveElement = lines?.[y - 1]?.[x];
      if (
        lines?.[y]?.[x] &&
        lines?.[y]?.[x] !== "^" &&
        (aboveElement === "S" || aboveElement === "|")
      ) {
        lines[y]![x] = "|";
      }
    }
  }

  console.log("Part one:", tachyonSplitCount);
}

async function solvePartTwo(filename: string) {
  const input = await Bun.file(filename).text();
  const lines = input.split("\n").map((v) => v.split(""));

  for (let y = 1; y < lines.length; y++) {
    const rowLength = lines[y]?.length;
    if (!rowLength) continue;

    for (let x = 0; x < rowLength; x++) {
      const currentElement = lines?.[y]?.[x];
      const aboveElement = lines?.[y - 1]?.[x];

      if (currentElement !== "^") {
        if (aboveElement === "S" || aboveElement === "1") {
          lines[y]![x] = "1";
        } else if (
          aboveElement &&
          aboveElement !== "." &&
          aboveElement !== "^"
        ) {
          lines[y]![x] = aboveElement!;
        }
      }
    }

    const splitterPresent = lines[y]?.some((v) => v === "^") ?? false;
    for (let x = 0; x < rowLength; x++) {
      if (!splitterPresent) continue;

      const currentElement = lines?.[y]?.[x];
      const aboveElement = lines?.[y - 1]?.[x];
      const leftElement = lines?.[y]?.[x - 1];
      const rightElement = lines?.[y]?.[x + 1];

      if (currentElement === "^" && aboveElement !== ".") {
        if (leftElement) {
          if (leftElement === ".") {
            lines[y]![x - 1] = aboveElement ? aboveElement : "1";
          } else {
            const int =
              parseInt(leftElement) +
              (aboveElement ? parseInt(aboveElement) : 0);
            lines[y]![x - 1] = `${int}`;
          }
        }

        if (rightElement) {
          if (rightElement === ".") {
            lines[y]![x + 1] = aboveElement ? aboveElement : "1";
          } else {
            const int =
              parseInt(rightElement) +
              (aboveElement ? parseInt(aboveElement) : 0);

            lines[y]![x + 1] = `${int}`;
          }
        }
      }
    }
  }

  const total = lines[lines.length - 1]
    ?.filter((v) => v !== ".")
    .map((v) => parseInt(v))
    .reduce((acc, curr) => (acc += curr));
  console.log("Part two:", total);
}

await solvePartOne("puzzle-input");
await solvePartTwo("puzzle-input");
