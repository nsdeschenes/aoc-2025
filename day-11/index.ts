interface Server {
  id: string;
  connections: string[];
}

interface Node {
  id: string;
  children: Node[];
}

async function solvePartOne(filename: string) {
  const input = await Bun.file(filename).text();
  const lines = input.split("\n");

  const servers: Server[] = [];
  for (const line of lines) {
    const splitLine = line.split(":");
    const id = splitLine[0].trim();
    const connections = splitLine[1].trim().split(" ");
    servers.push({ id, connections });
  }

  const lookup = new Map(servers.map((s) => [s.id, s.connections]));

  function buildTree(id: string, seen = new Set<string>()): Node {
    if (id === "out" || seen.has(id)) return { id, children: [] };
    seen.add(id);
    const children = (lookup.get(id) ?? []).map((childId) => {
      if (childId === "out") return { id: "out", children: [] };
      return buildTree(childId, new Set(seen));
    }); // copy to avoid sibling bleed
    return { id, children };
  }

  const root = buildTree("you");
  let connectionCount = 0;
  function findConnections(node: Node) {
    if (node.id === "out") {
      connectionCount += 1;
      return;
    }

    if (node.children.length === 0) {
      return;
    }

    for (const child of node.children) {
      findConnections(child);
    }
  }

  findConnections(root);

  console.log("Part one:", connectionCount);
}

async function solvePartTwo(filename: string) {
  const input = await Bun.file(filename).text();
  const lines = input.split("\n");

  const servers = new Map<string, string[]>(
    lines.map((line) => {
      const [id, connections] = line.split(":");
      return [id.trim(), connections.trim().split(/\s+/).filter(Boolean)];
    })
  );

  const cache = new Map<string, number>();
  function findPaths(start: string, end: string): number {
    const key = `${start}-${end}`;
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    const connections = servers.get(start);
    if (!connections) {
      cache.set(key, 0);
      return 0;
    }

    let paths = 0;
    for (const connection of connections) {
      if (connection === end) {
        paths += 1;
      } else if (servers.has(connection)) {
        paths += findPaths(connection, end);
      }
    }

    cache.set(key, paths);
    return paths;
  }

  const potentialPaths1 = [
    ["svr", "dac"],
    ["dac", "fft"],
    ["fft", "out"],
  ].reduce((acc, [start, end]) => acc * findPaths(start, end), 1);

  const potentialPaths2 = [
    ["svr", "fft"],
    ["fft", "dac"],
    ["dac", "out"],
  ].reduce((acc, [start, end]) => acc * findPaths(start, end), 1);

  console.log("Part two:", potentialPaths1 + potentialPaths2);
}

await solvePartOne("puzzle-input");
await solvePartTwo("puzzle-input");
