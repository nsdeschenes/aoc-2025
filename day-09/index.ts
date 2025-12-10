async function solvePartOne(filename: string) {
  const input = await Bun.file(filename).text();
  const cords = input
    .split("\n")
    .map((v) => v.split(",").map((v) => parseInt(v)));

  const gridSizes = new Set<number>();
  for (let i = 0; i < cords.length; i++) {
    const p1 = cords[i];
    if (!p1) continue;

    for (let j = 0; j < cords.length; j++) {
      const p2 = cords[j];
      if (!p2) continue;

      const dx = Math.abs(p2[0] - p1[0]);
      const dy = Math.abs(p2[1] - p1[1]);
      const gridSize = (dx + 1) * (dy + 1);
      gridSizes.add(gridSize);
    }
  }

  const largestSize = Array.from(gridSizes)
    .sort((a, b) => a - b)
    .pop();
  console.log("Part one:", largestSize);
}

async function solvePartTwo(filename: string) {
  const input = await Bun.file(filename).text();
  const cords = input
    .split("\n")
    .map((v) => v.split(",").map((v) => parseInt(v)));

  let [x1, y1] = cords[0];
  const verticalEdges = [];
  const horizontalEdges = [];
  for (const [x, y] of [...cords.slice(1), cords[0]]) {
    // vertical edge at x
    if (x === x1) {
      verticalEdges.push([x, ...[y1, y].toSorted()]);
    } else {
      // horizontal edge at y
      horizontalEdges.push([y, ...[x1, x].toSorted()]);
    }

    x1 = x;
    y1 = y;
  }

  const gridSizes = new Set<number>();
  for (let i = 0; i < cords.length; i++) {
    const p1 = cords[i];

    for (let j = 0; j < cords.length; j++) {
      const p2 = cords[j];
      const minX = Math.min(p1[0], p2[0]);
      const maxX = Math.max(p1[0], p2[0]);
      const minY = Math.min(p1[1], p2[1]);
      const maxY = Math.max(p1[1], p2[1]);

      const validRect = isValidRectangle(
        minX,
        maxX,
        minY,
        maxY,
        cords,
        verticalEdges,
        horizontalEdges
      );

      if (!validRect) continue;

      const dx = Math.abs(p2[0] - p1[0]);
      const dy = Math.abs(p2[1] - p1[1]);
      gridSizes.add((dx + 1) * (dy + 1));
    }
  }

  const largestSize = Array.from(gridSizes)
    .toSorted((a, b) => a - b)
    .pop();
  console.log("Part two:", largestSize);
}

function isValidRectangle(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  cords: number[][],
  verticalEdges: number[][],
  horizontalEdges: number[][]
) {
  const corners = [
    [minX, minY],
    [minX, maxY],
    [maxX, minY],
    [maxX, maxY],
  ];

  for (const corner of corners) {
    const matchingCorner = cords.some((testPoint) => {
      return testPoint[0] === corner[0] && testPoint[1] === corner[1];
    });

    let crossings = 0;
    const [x, y] = corner;
    for (const [xe, y1, y2] of verticalEdges) {
      if (y1 <= y && y < y2 && xe < x) {
        crossings += 1;
      }
    }

    for (const [ye, x1, x2] of horizontalEdges) {
      if (x1 <= x && x < x2 && ye < y) {
        crossings += 1;
      }
    }

    const pointInPolygon = crossings % 2 === 1;

    if (!matchingCorner && !pointInPolygon) {
      return false;
    }
  }

  for (const [edgeY, startX, endX] of horizontalEdges) {
    if (minY < edgeY && edgeY < maxY) {
      if (!(endX <= minX || startX >= maxX)) {
        return false;
      }
    }
  }

  for (const [edgeX, startY, endY] of verticalEdges) {
    if (minX < edgeX && edgeX < maxX) {
      if (!(endY <= minY || startY >= maxY)) {
        return false;
      }
    }
  }

  return true;
}

await solvePartOne("puzzle-input");
await solvePartTwo("puzzle-input");
