export type TreeNode =
  | {
      type: "union" | "concat" | "meta";
      lhs: TreeNode;
      rhs: TreeNode;
    }
  | string;

export interface FaState {
  id: number;
  // ends of substructure
  ends?: FaState[];
  trans: { [k: string]: FaState };
  eTrans: FaState[];
}

export class Re {
  re: string;
  i: number;
  stateId: number;
  parsed: TreeNode;
  nfa: FaState;
  constructor(re: string) {
    this.re = re;
    this.i = 0;
    this.stateId = 0;
    this.parsed = this.expr();
    this.nfa = this.constructNfa(this.parsed);
  }

  atEnd() {
    return this.re.length === this.i;
  }

  peek() {
    return this.re[this.i];
  }

  has(c: string) {
    return this.re[this.i] == c;
  }

  match(c: string) {
    if (this.peek() !== c)
      throw new Error(`Invalid character at ${this.i} (expected ${c}, got ${this.peek()})`);
    this.i++;
  }

  next() {
    const c = this.peek();
    this.i++;
    return c;
  }

  expr(): TreeNode {
    return this.union();
  }

  union(inAtom: boolean = false): TreeNode {
    const lhs = this.concat(inAtom);
    if (!this.atEnd() && this.has("|")) {
      this.match("|");
      return { type: "union", lhs, rhs: this.union(inAtom) };
    }

    return lhs;
  }

  concat(inAtom: boolean): TreeNode {
    const lhs = this.meta();
    // TODO ")" is bad case
    if (!inAtom && this.has(")")) throw new Error("Unmatched )");
    if (!this.atEnd() && !(inAtom && this.has(")")) && !this.has("|")) {
      const rhs = this.concat(inAtom);
      return { type: "concat", lhs, rhs };
    }

    return lhs;
  }

  meta(): TreeNode {
    const lhs = this.atom();
    if (!this.atEnd() && isMetaChar(this.peek())) {
      const rhs = this.next();
      return { type: "meta", lhs, rhs };
    }

    return lhs;
  }

  atom(): TreeNode {
    if (this.peek() === "(") {
      this.match("(");
      const exp = this.union(true);
      this.match(")");

      return exp;
      // return { type: "atom", lhs: exp, rhs: null };
    }

    return this.char();
  }

  char(): TreeNode {
    if (this.atEnd()) return "";
    if (isMetaChar(this.peek())) throw new Error(`Unexpected meta char ${this.peek()}`);
    if (this.peek() === ".") {
      this.match(".");
      return "any";
    }

    if (this.peek() === "\\") {
      this.match("\\");
      return this.next();
    }

    return this.next();
  }

  coalesseEnds(state: Required<FaState>): FaState {
    if (state.ends.length === 1) {
      return state.ends[0];
    } else {
      const newEnd = createState(this.stateId++);
      for (const end of state.ends) {
        end.eTrans.push(newEnd);
      }
      return newEnd;
    }
  }

  fixBackref(state: FaState, toFix: FaState) {
    console.log("toFix epsilon", toFix);
    toFix.eTrans[toFix.eTrans.findIndex((s) => s.id === state.id)] = state;
  }

  // TODO (a|a) still crashes
  constructNfa(node: TreeNode): Required<FaState> {
    if (typeof node === "string") {
      if (node === "") {
        return { id: this.stateId++, trans: {}, eTrans: [], ends: [] };
      }
      const id = this.stateId++;
      const end = createState(this.stateId++);
      return { id, ends: [end], trans: { [node]: end }, eTrans: [] };
    }
    switch (node.type) {
      case "union": {
        const lhs = this.constructNfa(node.lhs);
        this.stateId--;
        const rhs = this.constructNfa(node.rhs);
        lhs.eTrans = [...lhs.eTrans, ...rhs.eTrans];
        lhs.trans = { ...lhs.trans, ...rhs.trans };
        lhs.ends = [...lhs.ends, ...rhs.ends];
        if (typeof node.rhs === "object" && node.rhs.type === "meta" && (node.rhs.rhs as string) !== "?") {
          this.fixBackref(lhs, rhs);
        }
        return lhs;
      }
      case "concat": {
        const lhs = this.constructNfa(node.lhs);
        // TODO coalesse ends if there is only one transition from the next node
        const newEnd = this.coalesseEnds(lhs);
        this.stateId--;
        const rhs = this.constructNfa(node.rhs);
        newEnd.trans = rhs.trans;
        newEnd.eTrans = rhs.eTrans;
        lhs.ends = rhs.ends;
        return lhs;
      }
      case "meta": {
        // TODO so the issue is due to the nature of loops, the reference to the node that should be destroyed is maintained
        const op = node.rhs as string;
        if (op === "?") {
          const lhs = this.constructNfa(node.lhs);
          const end = createState(this.stateId++);
          lhs.ends.push(end);
          lhs.eTrans.push(end);
          return lhs;
        } else if (op === "*" || op === "+") {
          const lhs = this.constructNfa(node.lhs);
          const newEnd = this.coalesseEnds(lhs);
          const accepting = createState(this.stateId++);
          newEnd.eTrans.push(lhs);
          newEnd.eTrans.push(accepting);
          if (op === "*") lhs.eTrans.push(newEnd);
          lhs.ends = [accepting];
          return lhs;
        }
        // const id = this.stateId++;
        // const lhs = this.constructNfa(node.lhs);
        // const end = createState(this.stateId++);
        // if (op === "*" || op === "+") lhs.ends.eTrans.push(lhs);
        // lhs.ends.eTrans.push(end);
        // return { id, ends: end, trans: {}, eTrans: op === "+" ? [lhs] : [lhs, end] };

        // switch (node.rhs as string) {
        //   case "*": {
        //     const lhs = this.construct(node.lhs);
        //     const end = createState(this.stateId++);
        //     lhs.end.eTrans.push(lhs);
        //     lhs.end.eTrans.push(end);
        //     return { id, end, trans: {}, eTrans: [lhs, end] };
        //   }
        //   case "?": {
        //     const lhs = this.construct(node.lhs);
        //     const end = createState(this.stateId++);
        //     lhs.end.eTrans.push(end);
        //     return { id, end, trans: {}, eTrans: [lhs, end] };
        //   }
        //   case "+": {
        //     const lhs = this.construct(node.lhs);
        //     const end = createState(this.stateId++);
        //     lhs.end.eTrans.push(lhs);
        //     lhs.end.eTrans.push(end);
        //     return { id, end, trans: {}, eTrans: [lhs] };
        //   }
        // }
      }
    }
  }

  getStatesRec(state: FaState, nextStates: FaState[], visited: FaState[]) {
    if (state.eTrans.length) {
      for (const st of state.eTrans) {
        if (!visited.find((vs) => vs === st)) {
          visited.push(st);
          this.getStatesRec(st, nextStates, visited);
        }
      }
    }

    if (Object.keys(state.trans).length !== 0 || state.eTrans.length === 0) nextStates.push(state);

    return nextStates;
  }

  getStates(state: FaState) {
    return this.getStatesRec(state, [], []);
  }

  matchNfa(str: string): boolean {
    let currentStates = this.getStates(this.nfa);
    for (const c of str) {
      let nextStates: FaState[] = [];
      for (const state of currentStates) {
        const nextState = state.trans[c] ?? state.trans["any"];
        if (nextState) {
          nextStates = nextStates.concat(this.getStates(nextState));
        }
      }
      currentStates = nextStates;
    }
    return !!currentStates.find(isAccepting);
  }
}

export const createState = (id: number): FaState => ({ id, trans: {}, eTrans: [] });
export const isAccepting = (state: FaState) =>
  state.eTrans.length === 0 && Object.keys(state.trans).length === 0;

const isMetaChar = (c: string) => c === "*" || c === "+" || c === "?";
