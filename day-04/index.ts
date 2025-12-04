async function solvePartOne(filename: string) {
  const input = await Bun.file(filename).text();
  const grid = input.split("\n").map((row) => row.split(""));

  const directions = [
    // check top left: y - 1, x -1
    [-1, -1],
    // check top: y - 1, x
    [-1, 0],
    // check top right: y - 1, x + 1
    [-1, 1],
    // check left: y, x - 1
    [0, -1],
    // check right: y, x + 1
    [0, 1],
    // check bottom left: y + 1, x - 1
    [1, -1],
    // check bottom: y + 1, x
    [1, 0],
    // check bottom right: y + 1, x + 1
    [1, 1],
  ];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      const currentPos = grid[y]![x];
      // skip checking nothing
      if (currentPos === ".") {
        continue;
      }

      let count = 0;
      for (const [dy, dx] of directions) {
        if (typeof dy === "undefined" || typeof dx === "undefined") continue;

        const neighbor = grid[y + dy]?.[x + dx];
        if (neighbor === "@" || neighbor === "x") {
          count++;

          // exit early
          if (count >= 4) break;
        }
      }

      if (count < 4) {
        grid[y]![x] = "x";
      }
    }
  }

  console.log(
    "Part one:",
    grid
      .map((r) => r.join(""))
      .join("")
      .split("x").length - 1
  );
}

async function solvePartTwo(filename: string) {
  const input = await Bun.file(filename).text();
  let grid = input.split("\n").map((row) => row.split(""));

  const directions = [
    // check top left: y - 1, x -1
    [-1, -1],
    // check top: y - 1, x
    [-1, 0],
    // check top right: y - 1, x + 1
    [-1, 1],
    // check left: y, x - 1
    [0, -1],
    // check right: y, x + 1
    [0, 1],
    // check bottom left: y + 1, x - 1
    [1, -1],
    // check bottom: y + 1, x
    [1, 0],
    // check bottom right: y + 1, x + 1
    [1, 1],
  ];

  let totalRemovedRolls = 0;
  while (true) {
    let rollsToRemove = 0;
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y]!.length; x++) {
        const currentPos = grid[y]![x];
        // skip checking nothing
        if (currentPos === ".") {
          continue;
        }

        let count = 0;
        for (const [dy, dx] of directions) {
          if (typeof dy === "undefined" || typeof dx === "undefined") continue;

          const neighbor = grid[y + dy]?.[x + dx];
          if (neighbor === "@" || neighbor === "x") {
            count++;

            // exit early
            if (count >= 4) break;
          }
        }

        if (count < 4) {
          grid[y]![x] = "x";
          rollsToRemove++;
        }
      }
    }

    if (rollsToRemove === 0) {
      break;
    }

    // reset grid
    grid = grid.map((r) => r.map((p) => (p === "x" ? "." : p)));
    totalRemovedRolls += rollsToRemove;
  }

  console.log("Part two:", totalRemovedRolls);
}

await solvePartOne("puzzle-input");
await solvePartTwo("puzzle-input");
