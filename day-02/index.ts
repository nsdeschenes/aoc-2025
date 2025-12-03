async function solvePartOne(filename: string) {
  const productRanges = (await Bun.file(filename).text()).split(",");
  const invalidIds: number[] = [];

  for (const range of productRanges) {
    const [firstIdStr, lastIdStr] = range.split("-");
    const firstId = parseInt(firstIdStr);
    const lastId = parseInt(lastIdStr);

    for (let i = firstId; i <= lastId; i++) {
      const currentIStr = `${i}`;
      if (currentIStr.length % 2 !== 0) {
        continue;
      }

      const halfLength = Math.ceil(currentIStr.length / 2);
      const firstHalf = currentIStr.slice(0, halfLength);
      const secondHalf = currentIStr.slice(halfLength);

      if (firstHalf === secondHalf) {
        invalidIds.push(i);
      }
    }
  }

  console.log(
    "Part one:",
    invalidIds.reduce((acc, curr) => acc + curr, 0)
  );
}

async function solvePartTwo(filename: string) {
  const productRanges = (await Bun.file(filename).text()).split(",");
  const invalidIds: number[] = [];

  for (const range of productRanges) {
    const [firstIdStr, lastIdStr] = range.split("-");
    const firstId = parseInt(firstIdStr);
    const lastId = parseInt(lastIdStr);

    for (let i = firstId; i <= lastId; i++) {
      const currentIStr = `${i}`;

      const regexMatches = currentIStr.match(/^(.+?)\1+$/);
      if (!regexMatches) continue;
      const combinedSeenNumbers = regexMatches[1];

      let count = 0;
      let position = currentIStr.indexOf(combinedSeenNumbers);
      while (position !== -1) {
        count++;

        position = currentIStr.indexOf(
          combinedSeenNumbers,
          position + combinedSeenNumbers.length
        );
      }

      if (count > 1) {
        invalidIds.push(i);
      }
    }
  }

  console.log(
    "Part two:",
    invalidIds.values().reduce((acc, curr) => acc + curr, 0)
  );
}

await solvePartOne("puzzle-input");
await solvePartTwo("puzzle-input");
