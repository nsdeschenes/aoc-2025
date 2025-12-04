async function solvePartOne(filename: string) {
  const input = await Bun.file(filename).text();
  const batteryBanks = input
    .split("\n")
    .map((bank) => bank.split("").map((joltage) => parseInt(joltage)));

  const highestJoltages: number[] = [];
  for (const bank of batteryBanks) {
    // find the highest number in bank.length - 1
    let highestJoltage = 0;
    let highestJoltageIndex = 0;
    for (let i = 0; i < bank.length - 1; i++) {
      if (bank[i] > highestJoltage) {
        highestJoltage = bank[i];
        highestJoltageIndex = i;
      }
    }

    let secondHighestJoltage = 0;
    for (let i = highestJoltageIndex + 1; i < bank.length; i++) {
      if (bank[i] > secondHighestJoltage) {
        secondHighestJoltage = bank[i];
      }
    }

    highestJoltages.push(parseInt(`${highestJoltage}${secondHighestJoltage}`));
  }

  const totalJoltageOutput = highestJoltages.reduce(
    (acc, curr) => (acc += curr),
    0
  );
  console.log("Part one:", totalJoltageOutput);
}

async function solvePartTwo(filename: string) {
  const input = await Bun.file(filename).text();
  const batteryBanks = input
    .split("\n")
    .map((bank) => bank.split("").map((joltage) => parseInt(joltage)));

  const highestJoltages: number[] = [];
  for (const bank of batteryBanks) {
    const joltageLength = 12;
    const toRemove = bank.length - joltageLength;

    let removed = 0;
    const result: number[] = [];
    for (let i = 0; i < bank.length; i++) {
      while (
        result.length > 0 &&
        removed < toRemove &&
        bank[i] > result[result.length - 1]
      ) {
        result.pop();
        removed++;
      }

      if (result.length < joltageLength) {
        result.push(bank[i]);
      } else {
        removed++;
      }
    }
    highestJoltages.push(parseInt(result.join("")));
    break;
  }

  const totalJoltageOutput = highestJoltages.reduce(
    (acc, curr) => (acc += curr),
    0
  );
  console.log("Part two:", totalJoltageOutput);
}

await solvePartOne("puzzle-input");
await solvePartTwo("puzzle-input");
