interface Region {
  width: number;
  length: number;
  presents: number[];
}

async function solvePartOne(filename: string) {
  const input = await Bun.file(filename).text();
  const lines = await input.split("\n");

  const regions: Region[] = [];
  const presentShapes: string[][][] = [];

  let counter = 0;
  let index = 0;
  for (const line of lines) {
    if (line.includes("#") || line.includes(".")) {
      if (!Array.isArray(presentShapes[index])) {
        presentShapes.push([]);
      }

      presentShapes[index].push(line.split(""));

      if (counter === 2) {
        index += 1;
        counter = 0;
      } else {
        counter += 1;
      }
    }

    if (line.includes("x")) {
      const [grid, region] = line.split(":");

      const [width, length] = grid
        .trim()
        .split("x")
        .map((v) => parseInt(v));

      const presents = region
        .trim()
        .split(" ")
        .map((v) => parseInt(v));

      regions.push({ width, length, presents });
    }
  }

  let regionCount = 0;
  for (const region of regions) {
    const regionSize = region.width * region.length;

    const totalBoxSizes: number = region.presents
      .map((presentCount, i) => {
        return (
          presentShapes[i]
            .flatMap((p) => p.map((t) => (t === "#" ? 1 : 0) as number))
            .reduce((acc, curr) => (acc += curr)) * presentCount
        );
      })
      .reduce((acc, curr) => (acc += curr));

    if (regionSize >= totalBoxSizes) {
      regionCount += 1;
    }
  }

  console.log("Part one:", regionCount);
}

await solvePartOne("puzzle-input");
