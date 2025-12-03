async function solvePartOne(filename: string): Promise<void> {
  const input = await Bun.file(filename).text();
  const lines = input.split("\n");

  let currentClick = 50;
  let zeroHitCounter = 0;

  for (const line of lines) {
    const direction = line[0];
    const clickCount = parseInt(line.slice(1));

    if (direction === "L") {
      for (let i = 0; i < clickCount; i++) {
        if (currentClick === 0) {
          currentClick = 99;
          continue;
        }

        currentClick--;
      }
    }

    if (direction === "R") {
      for (let i = 0; i < clickCount; i++) {
        if (currentClick === 99) {
          currentClick = 0;
          continue;
        }

        currentClick++;
      }
    }

    if (currentClick === 0) {
      zeroHitCounter++;
    }
  }

  console.log("Part one:", zeroHitCounter);
}

async function solvePartTwo(filename: string): Promise<void> {
  const input = await Bun.file(filename).text();
  const lines = input.split("\n");

  let currentClick = 50;
  let zeroHitCounter = 0;

  let counter = 0;
  for (const line of lines) {
    const direction = line[0];
    const clickCount = parseInt(line.slice(1));

    if (direction === "L") {
      for (let i = 0; i < clickCount; i++) {
        if (currentClick === 0 && i !== 0) {
          zeroHitCounter++;
        }

        if (currentClick === 0) {
          currentClick = 99;
          continue;
        }

        currentClick--;
      }
    }

    if (direction === "R") {
      for (let i = 0; i < clickCount; i++) {
        if (currentClick === 0 && i !== 0) {
          zeroHitCounter++;
        }

        if (currentClick === 99) {
          currentClick = 0;
          continue;
        }

        currentClick++;
      }
    }

    if (currentClick === 0) {
      zeroHitCounter++;
    }
  }

  console.log("Part two:", zeroHitCounter);
}

await solvePartOne("puzzle-input");
await solvePartTwo("puzzle-input");
