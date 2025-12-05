async function solvePartOne(filename: string) {
  const input = await Bun.file(filename).text();
  const lines = input.split("\n");

  const freshIngredientIdRanges: BigInt[][] = [];
  const availableIngredientIds: BigInt[] = [];

  for (const line of lines) {
    if (line.includes("-")) {
      const [start, end] = line.split("-");
      if (!start || !end) continue;
      freshIngredientIdRanges.push([BigInt(start), BigInt(end)]);
    } else if (line.match(/\d/)) {
      availableIngredientIds.push(BigInt(line));
    }
  }

  let count = 0;
  for (const id of availableIngredientIds) {
    for (const range of freshIngredientIdRanges) {
      if (!range[0] || !range[1]) continue;

      if (id >= range[0] && id <= range[1]) {
        count++;
        break;
      }
    }
  }

  console.log("Part one:", count);
}

async function solvePartTwo(filename: string) {
  const input = await Bun.file(filename).text();
  const lines = input.split("\n");

  const freshIngredientIdRanges: BigInt[][] = [];
  for (const line of lines) {
    if (line.includes("-")) {
      const [start, end] = line.split("-");
      if (!start || !end) continue;
      freshIngredientIdRanges.push([BigInt(start), BigInt(end)]);
    }
  }

  // need to sort so we can find overlapping ranges
  freshIngredientIdRanges.sort((a, b) => {
    if (!a[0] || !b[0]) return 0;
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  });

  // need to merge to remove overlapping ranges
  const merged: BigInt[][] = [];
  for (const range of freshIngredientIdRanges) {
    if (!range[0] || !range[1]) continue;
    if (typeof range[0] !== "bigint") continue;
    if (typeof range[1] !== "bigint") continue;

    if (merged.length === 0) {
      merged.push([range[0], range[1]]);
      continue;
    }

    const last = merged[merged.length - 1];
    if (!last || typeof last[0] !== "bigint" || typeof last[1] !== "bigint")
      continue;

    // see if overlapping or adjacent (end >= nextStart - 1)
    if (last[1] >= range[0] - 1n) {
      // extend end if needed
      if (range[1] > last[1]) {
        last[1] = range[1];
      }
    } else {
      merged.push([range[0], range[1]]);
    }
  }

  let total = 0n;
  for (const [start, end] of merged) {
    if (typeof end !== "bigint") continue;
    if (typeof start !== "bigint") continue;
    total += end - start + 1n;
  }

  console.log("Part two:", total);
}

await solvePartOne("puzzle-input");
await solvePartTwo("puzzle-input");
