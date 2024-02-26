type Clues = { across: { [k: number]: string }; down: { [k: number]: string } };
export type Direction = "up" | "down" | "left" | "right";

// TODO pretty sure you can get rid of the x,y representation
export class Puzzle {
  title: string;
  author: string;
  copyright: string;
  notes: string;

  width: number;
  height: number;
  solution: string;
  grid: string;
  gridNums: number[];
  clues: Clues;

  cursor: number;
  facing: keyof Clues;
  constructor({
    title,
    author,
    copyright,
    notes,
    width,
    height,
    solution,
    grid,
    clues,
  }: {
    title: string;
    author: string;
    copyright: string;
    notes: string;
    width: number;
    height: number;
    solution: string;
    grid: string;
    clues: string[];
  }) {
    this.title = title;
    this.author = author;
    this.copyright = copyright;
    this.notes = notes;
    this.width = width;
    this.height = height;
    this.solution = solution;
    this.grid = grid;
    this.gridNums = new Array(width * height);
    this.clues = this.genClues(clues);
    this.cursor = 0;
    for (let i = 0; this.solution[i] === "."; i++) this.cursor = i + 1;
    if (!this.clues.across[1] && this.clues.down[1]) this.facing = "down";
    else this.facing = "across";
  }

  // creates the array of indices that need to be highlighted
  coord(i: number): { x: number; y: number } {
    return { x: i % this.width, y: Math.floor(i / this.width) };
  }

  index(x: number, y: number): number {
    return y * this.width + x;
  }

  wordInfo(): { wordNum: number, parts: number[] } {
    let wordNum = null;
    const { x, y } = this.coord(this.cursor);
    const parts = [];
    if (this.facing === "across") {
      for (let xprime = x; xprime >= 0 && !this.isBlackCell(xprime, y); xprime--) {
        wordNum = this.gridNums[this.index(xprime, y)] ?? wordNum;
        parts.push(this.index(xprime, y));
      }

      for (let xprime = x + 1; xprime < this.width && !this.isBlackCell(xprime, y); xprime++) {
        parts.push(this.index(xprime, y));
      }
    } else {
      for (let yprime = y; yprime >= 0 && !this.isBlackCell(x, yprime); yprime--) {
        wordNum = this.gridNums[this.index(x, yprime)] ?? wordNum;
        parts.push(this.index(x, yprime));
      }

      for (let yprime = y + 1; yprime < this.height && !this.isBlackCell(x, yprime); yprime++) {
        parts.push(this.index(x, yprime));
      }
    }
    return {
      wordNum: wordNum as number,
      parts,
    }
  }

  switchFacing() {
    this.facing = this.facing === "across" ? "down" : "across";
  }

  move(dir: Direction): boolean {
    // TODO skip over black cells
    const { x, y } = this.coord(this.cursor);

    if (dir === "up" || dir === "down") {
      const yDir = dir === "up" ? -1 : 1;
      let yOffset = yDir;
      while (this.isBlackCell(x, y + yOffset)) yOffset += yDir;
      const newY = y + yOffset;
      if (newY < 0 || newY >= this.height) return false;
      else {
        this.cursor = this.index(x, newY);
        return true;
      }
    } else if (dir === "left" || dir === "right") {
      const xDir = dir === "left" ? -1 : 1;
      let xOffset = xDir;
      while (this.isBlackCell(x + xOffset, y)) xOffset += xDir;
      const newX = x + xOffset;
      if (newX < 0 || newX >= this.width) return false;
      else {
        this.cursor = this.index(newX, y);
        return true;
      }
    }

    // unreachable smh ts do better
    return false;
  }

  setCell(i: number, char: string) {
    if (char.length !== 1 || this.grid[i] === ".") return;
    const gridChars = [...this.grid];
    gridChars[i] = char.toUpperCase();
    this.grid = gridChars.join("");
  }

  getSol(x: number, y: number): string | undefined {
    return this.solution.at(this.index(x, y));
  }

  isBlackCell(x: number, y: number): boolean {
    return this.getSol(x, y) === ".";
  }

  getGrid(x: number, y: number): string {
    return this.grid[this.index(x, y)];
  }

  cellNeedsAcrossNumber(x: number, y: number): boolean {
    if (x == 0 || this.isBlackCell(x - 1, y)) return true;
    return false;
  }

  cellNeedsDownNumber(x: number, y: number): boolean {
    if (y == 0 || this.isBlackCell(x, y - 1)) return true;
    return false;
  }

  genClues(allClues: string[]): Clues {
    let across: Record<number, string> = {};
    let down: Record<number, string> = {};
    let currentCellNumber = 1;
    let clueI = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.isBlackCell(x, y)) continue;
        let assigned = false;
        if (this.cellNeedsAcrossNumber(x, y)) {
          across[currentCellNumber] = allClues[clueI];
          this.gridNums[y * this.width + x] = currentCellNumber;
          assigned = true;
          clueI++;
        }

        if (this.cellNeedsDownNumber(x, y)) {
          down[currentCellNumber] = allClues[clueI];
          this.gridNums[y * this.width + x] = currentCellNumber;
          assigned = true;
          clueI++;
        }
        if (assigned) currentCellNumber++;
      }
    }

    return {
      across,
      down,
    };
  }
}

// https://web.archive.org/web/20110806052658/http://acrossdown.net/specification.htm
// https://code.google.com/archive/p/puz/wikis/FileFormat.wiki
export const parsePuzFile = (puz: string): Puzzle => {
  // get null termed or fixed len string
  const str = (i: number, len?: number): string =>
    puz.substring(i, (len ?? puz.substring(i).indexOf("\u0000")) + i);
  const byte = (i: number): number => puz.charCodeAt(i);
  const short = (i: number): number => puz.charCodeAt(i) + (puz.charCodeAt(i + 1) << 8);
  // File Magic
  if (str(0x02) !== "ACROSS&DOWN") throw new Error("File does not seem to be valid .puz file.");
  const version = str(0x18);

  // grid info
  const width = byte(0x2c);
  const height = byte(0x2d);
  const cells = width * height;

  const numClues = short(0x2e);
  const solution = str(0x34, cells);
  const grid = str(0x34 + cells, cells)
    .split("")
    .map((x) => (x === "-" ? " " : x))
    .join("");

  // metadata offset
  const metadata = 0x34 + cells + cells;
  const title = str(metadata);
  const author = str(metadata + title.length + 1);
  const copyright = str(metadata + title.length + author.length + 2);

  let nextClue = metadata + title.length + author.length + copyright.length + 3;
  const clues: string[] = [];
  for (let i = 0; i < numClues; i++) {
    clues.push(str(nextClue));
    nextClue += (clues.at(-1) as string).length + 1;
  }
  const notes = str(nextClue, puz.length - nextClue - 1);

  return new Puzzle({ title, author, copyright, notes, width, height, solution, grid, clues });
};
