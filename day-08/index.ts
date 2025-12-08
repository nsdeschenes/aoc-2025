// Couldn't figure this one out on my own, shout out to:
// https://github.com/bastuijnman/adventofcode/blob/master/2025/08-12/answer.ts

type JunctionBox = {
  x: number;
  y: number;
  z: number;
};

type Circuit = {
  boxIndices: number[];
};

// Calculate euclidian distance, see:
// https://en.wikipedia.org/wiki/Euclidean_distance
function calculateDistance(a: JunctionBox, b: JunctionBox): number {
  return (b.x - a.x) ** 2 + (b.y - a.y) ** 2 + (b.z - a.z) ** 2;
}

// Filter out only unique pairs.
const unique = (pairs: [number, number][]): [number, number][] => {
  const cache = new Set();
  return pairs.filter((pair) => {
    pair.sort();
    const key = `${pair[0]},${pair[1]}`;
    if (cache.has(key)) {
      return false;
    }
    cache.add(key);
    return true;
  });
};

async function solvePartOne(filename: string) {
  const input = await Bun.file(filename).text();
  const lines = input.split("\n").slice(0, -1);

  const boxes: JunctionBox[] = lines.map((line) => {
    const cords = line.match(/(\d+)/g)!;
    return {
      x: parseInt(cords[0]),
      y: parseInt(cords[1]),
      z: parseInt(cords[2]),
    };
  });
  const circuits: Circuit[] = boxes.map((_, i) => ({ boxIndices: [i] }));

  // Generate all possible distance pairs
  // Filter on unique pairs and sort by their actual distance.
  const distances = unique(
    boxes
      .flatMap((_, a) => boxes.map((_, b) => [a, b]))
      .filter((i) => i[0] !== i[1]) as [number, number][]
  ).sort(
    (a, b) =>
      calculateDistance(boxes[a[0]], boxes[a[1]]) -
      calculateDistance(boxes[b[0]], boxes[b[1]])
  );

  for (let i = 0; i <= 1000; i++) {
    // Find circuits for both entries in the distance pair.
    const firstIndex = circuits.findIndex((circuit) =>
      circuit.boxIndices.includes(distances[i][0])
    );
    const secondIndex = circuits.findIndex((circuit) =>
      circuit.boxIndices.includes(distances[i][1])
    );

    // Merge two circuits when they exist and get rid of one of them.
    if (
      firstIndex !== secondIndex &&
      circuits[firstIndex].boxIndices.length >= 1 &&
      circuits[secondIndex].boxIndices.length >= 1
    ) {
      circuits[firstIndex].boxIndices = circuits[firstIndex].boxIndices.concat(
        circuits[secondIndex].boxIndices
      );
      circuits.splice(secondIndex, 1);
    }
  }

  // Sort and take the biggest 3 circuits
  const total = circuits
    .sort((a, b) => b.boxIndices.length - a.boxIndices.length)
    .slice(0, 3)
    .map((circuit) => circuit.boxIndices.length)
    .reduce((prev, curr) => prev * curr);
  console.log("Part one:", total);
}

async function solvePartTwo(filename: string) {
  const input = await Bun.file(filename).text();
  const lines = input.split("\n").slice(0, -1);

  const boxes: JunctionBox[] = lines.map((line) => {
    const cords = line.match(/(\d+)/g)!;
    return {
      x: parseInt(cords[0]),
      y: parseInt(cords[1]),
      z: parseInt(cords[2]),
    };
  });
  const circuits: Circuit[] = boxes.map((_, i) => ({ boxIndices: [i] }));

  // Generate all possible distance pairs
  // Filter on unique pairs and sort by their actual distance.
  const distances = unique(
    boxes
      .flatMap((_, a) => boxes.map((_, b) => [a, b]))
      .filter((i) => i[0] !== i[1]) as [number, number][]
  ).sort(
    (a, b) =>
      calculateDistance(boxes[a[0]], boxes[a[1]]) -
      calculateDistance(boxes[b[0]], boxes[b[1]])
  );

  for (let i = 0; i < distances.length; i++) {
    // Find circuits for both entries in the distance pair.
    const firstIndex = circuits.findIndex((circuit) =>
      circuit.boxIndices.includes(distances[i][0])
    );
    const secondIndex = circuits.findIndex((circuit) =>
      circuit.boxIndices.includes(distances[i][1])
    );

    // Merge two circuits when they exist and get rid of one of them.
    if (
      firstIndex !== secondIndex &&
      circuits[firstIndex].boxIndices.length >= 1 &&
      circuits[secondIndex].boxIndices.length >= 1
    ) {
      circuits[firstIndex].boxIndices = circuits[firstIndex].boxIndices.concat(
        circuits[secondIndex].boxIndices
      );
      circuits.splice(secondIndex, 1);
    }

    // It's all converged to one circuit, part two done.
    if (circuits.length === 1) {
      const total = boxes[distances[i][0]].x * boxes[distances[i][1]].x;
      console.log("Part two:", total);
      return;
    }
  }
}

await solvePartOne("puzzle-input");
await solvePartTwo("puzzle-input");
