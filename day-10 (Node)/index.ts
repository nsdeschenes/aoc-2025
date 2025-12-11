import { init } from "z3-solver";
import { readFile } from "fs/promises";

interface PartOneMachine {
  lightStatus: string[];
  lightDiagram: string[];
  wiringSchematics: number[][];
  joltageRequirements: number[];
}

async function solvePartOne(filename: string) {
  const input = await readFile(filename, "utf-8");
  const lines = input.split("\n");

  const machines: PartOneMachine[] = [];
  for (const line of lines) {
    const lightDiagram = line.match(/(\.|#)+/)?.[0]?.split("") ?? [];

    const wiringSchematics: number[][] = [];
    line.matchAll(/\((\d|,)+\)/g).forEach((m) => {
      wiringSchematics.push(
        m[0]
          .slice(1, -1)
          .split(",")
          .map((v) => parseInt(v))
      );
    });

    const joltageRequirements =
      line
        .match(/\{(\d|,)+\}/)?.[0]
        ?.slice(1, -1)
        ?.split(",")
        ?.map((v) => parseInt(v)) ?? [];

    machines.push({
      lightStatus: Array.from({ length: lightDiagram.length }, () => "."),
      lightDiagram,
      wiringSchematics,
      joltageRequirements,
    });
  }

  const lowestTimes: number[] = [];
  for (const machine of machines) {
    const target = machine.lightDiagram.join("");
    const visited = new Set<string>();
    const queue: { state: string[]; time: number }[] = [
      { state: machine.lightStatus, time: 0 },
    ];
    visited.add(machine.lightStatus.join(""));

    let solution: number | null = null;
    let queueIndex = 0;
    while (queueIndex < queue.length && solution === null) {
      const { state: current, time } = queue[queueIndex++];
      const nextTime = time + 1;

      for (const button of machine.wiringSchematics) {
        const nextState: string[] = new Array(current.length);
        for (let i = 0; i < current.length; i++) {
          nextState[i] = button.includes(i)
            ? current[i] === "."
              ? "#"
              : "."
            : current[i];
        }

        const nextStateStr = nextState.join("");
        if (!visited.has(nextStateStr)) {
          if (nextStateStr === target) {
            solution = nextTime;
            break;
          }

          visited.add(nextStateStr);
          queue.push({ state: nextState, time: nextTime });
        }
      }
    }

    lowestTimes.push(solution ?? 0);
  }

  const total = lowestTimes.reduce((acc, curr) => acc + curr);
  console.log("Part one:", total);
}

interface PartTwoMachine {
  lightDiagram: string[];
  wiringSchematics: number[][];
  joltageRequirements: number[];
  joltageStatus: number[];
}

async function solvePartTwo(filename: string) {
  const input = await readFile(filename, "utf-8");
  const lines = input.split("\n");

  const { Context } = await init();
  const ctx = Context("main");
  const { Int, Sum, Optimize } = ctx;

  const machines: PartTwoMachine[] = [];
  for (const line of lines) {
    const lightDiagram = line.match(/(\.|#)+/)?.[0]?.split("") ?? [];

    const wiringSchematics: number[][] = [];
    line.matchAll(/\((\d|,)+\)/g).forEach((m) => {
      wiringSchematics.push(
        m[0]
          .slice(1, -1)
          .split(",")
          .map((v) => parseInt(v))
      );
    });

    const joltageRequirements =
      line
        .match(/\{(\d|,)+\}/)?.[0]
        ?.slice(1, -1)
        ?.split(",")
        ?.map((v) => parseInt(v)) ?? [];

    machines.push({
      lightDiagram,
      wiringSchematics,
      joltageRequirements,
      joltageStatus: Array.from(
        { length: joltageRequirements.length },
        () => 0
      ),
    });
  }

  const lowestTimes: number[] = [];
  for (const machine of machines) {
    // Check if unsatisfiable before creating optimize
    let unsatisfiable = false;
    for (const [position, joltage] of machine.joltageRequirements.entries()) {
      let hasAffectingButton = false;
      for (const button of machine.wiringSchematics) {
        if (button.includes(position)) {
          hasAffectingButton = true;
          break;
        }
      }
      if (!hasAffectingButton && joltage !== 0) {
        unsatisfiable = true;
        break;
      }
    }

    if (unsatisfiable) {
      lowestTimes.push(0);
      continue;
    }

    const optimize = new Optimize();

    const pressCounts = Array.from(
      { length: machine.wiringSchematics.length },
      (_, i) => Int.const(`c_${i}`)
    );

    for (const count of pressCounts) {
      optimize.add(count.ge(0));
    }

    for (const [position, joltage] of machine.joltageRequirements.entries()) {
      const affects: typeof pressCounts = [];
      for (const [index, button] of machine.wiringSchematics.entries()) {
        if (button.includes(position)) {
          affects.push(pressCounts[index]);
        }
      }
      if (affects.length > 0) {
        // @ts-expect-error - types aren't happy ... but it works
        optimize.add(Sum(...affects).eq(Int.val(joltage)));
      }
    }

    // @ts-expect-error - types aren't happy ... but it works
    optimize.minimize(Sum(...pressCounts));
    const result = await optimize.check();

    if (result === "sat") {
      const model = optimize.model();
      let total = 0;
      for (const count of pressCounts) {
        const value = model.eval(count);
        if (ctx.isIntVal(value)) {
          total += Number(value.value());
        }
      }
      lowestTimes.push(total);
    } else {
      lowestTimes.push(0);
    }
  }

  const total = lowestTimes.reduce((acc, curr) => acc + curr);
  console.log("Part two:", total);
}

const partOneStart = performance.now();
await solvePartOne("puzzle-input");
const partOneTotal = performance.now() - partOneStart;
console.log("Part one ran in:", `${partOneTotal}ms`);

const partTwoStart = performance.now();
await solvePartTwo("puzzle-input");
const partTwoTotal = performance.now() - partTwoStart;
console.log("Part two ran in:", `${partTwoTotal}ms`);
