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

// TODO switch back to state id
export type TraversalTick = { state: FaState; from: FaState; accepting: boolean; i: number }[];

export class Re {
  re: string;
  i: number;
  stateId: number;
  parsed: TreeNode;
  nfa: FaState;
  prevTraversal: TraversalTick[];
  constructor(re: string) {
    this.re = re;
    this.i = 0;
    this.stateId = 0;
    this.parsed = this.expr();
    this.nfa = this.constructNfa(this.parsed);
    this.prevTraversal = [];
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

  mergeNodes(lhs: Required<FaState>, rhs: Required<FaState>) {
    lhs.eTrans = [...lhs.eTrans, ...rhs.eTrans];
    const keys = new Set([...Object.keys(lhs), ...Object.keys(rhs)]);
    const newTrans = [];
    for (const key in keys) {
      if (lhs.trans[key] && rhs.trans[key]) {
      }
    }

    lhs.trans = { ...lhs.trans, ...rhs.trans };
    lhs.ends = [...lhs.ends, ...rhs.ends];
  }

  fixBackref(state: FaState, toFix: FaState) {
    let found = false;
    let visited: FaState[] = [];
    const rec = (s: FaState) => {
      for (const i in s.eTrans) {
        const trans = s.eTrans[i];
        if (!visited.find((x) => x === trans) && !found) {
          if (trans.id === toFix.id) {
            s.eTrans[i] = state;
            found = true;
          }
          visited.push(trans);
          rec(trans);
        }
      }

      for (const i in Object.keys(s.trans)) {
        const trans = s.eTrans[i];
        if (!visited.find((x) => x === trans) && !found) {
          if (trans.id === toFix.id) {
            s.eTrans[i] = state;
          }
          visited.push(trans);
          rec(trans);
        }
      }
    };
    rec(toFix);
    // toFix.eTrans[toFix.eTrans.findIndex((s) => s.id === state.id)] = state;
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
        if (node.lhs === node.rhs) return lhs;
        // TODO this is a really bandaid fix to a|a
        // the fix is probably function to merge transisitions that fixes up any nodes
        this.stateId--;
        const rhs = this.constructNfa(node.rhs);
        lhs.eTrans = [...lhs.eTrans, ...rhs.eTrans];
        lhs.trans = { ...lhs.trans, ...rhs.trans };
        lhs.ends = [...lhs.ends, ...rhs.ends];
        // if (
        //   typeof node.rhs === "object" &&
        //   node.rhs.type === "meta" &&
        //   (node.rhs.rhs as string) !== "?"
        // ) {
        //   this.fixBackref(lhs, rhs);
        // }
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
        // if (
        //   typeof node.rhs === "object" &&
        //   node.rhs.type === "meta" &&
        //   (node.rhs.rhs as string) !== "?"
        // ) {
        //   this.fixBackref(lhs, rhs);
        // }

        return lhs;
      }
      case "meta": {
        const op = node.rhs as "?" | "*" | "+";
        if (op === "?") {
          const lhs = this.constructNfa(node.lhs);
          const end = createState(this.stateId++);
          lhs.ends.push(end);
          lhs.eTrans.push(end);
          return lhs;
        } else if (op === "*") {
          const loopNode = createState(this.stateId++);
          const lhs = this.constructNfa(node.lhs);
          const newEnd = this.coalesseEnds(lhs);
          const accepting = createState(this.stateId++);
          loopNode.eTrans.push(lhs);
          loopNode.eTrans.push(accepting);
          loopNode.ends = [accepting];
          newEnd.eTrans.push(loopNode);
          return loopNode as Required<FaState>;
        } else if (op === "+") {
          const lhs = this.constructNfa(node.lhs);
          const newEnd = this.coalesseEnds(lhs);
          const loopNode = createState(this.stateId++);
          const accepting = createState(this.stateId++);
          loopNode.eTrans.push(lhs);
          loopNode.eTrans.push(accepting);
          lhs.ends = [accepting];
          newEnd.eTrans.push(loopNode);
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

  // getStates(state: FaState) {
  //   let nextStates: FaState[] = [];
  //   this.getStatesRec(state, nextStates, []);
  //   const tick = this.prevTraversal[this.prevTraversal.length - 1];
  //   for (const ns of nextStates) {
  //     tick.push({ node: ns, from: state, accepting: isAccepting(ns) });
  //   }
  //   console.log(nextStates)
  //   return nextStates;
  // }

  // TODO okay the issue is every head needs its own consumption
  // then when a head finishes consuption, it either hits an ending node
  // or dies off
  // currently a* breaks
  matchNfa(str: string): boolean {
    this.prevTraversal = [[{ from: this.nfa, state: this.nfa, accepting: false, i: 0 }]];
    let currentStates = [{ i: 0, state: this.nfa }];
    while (currentStates.length !== 0) {
      // if (
      //   i === str.length &&
      //   !currentStates.some((s) => this.getStatesRec(s, [], []).some(isAccepting))
      // )
      //   break;
      let nextStates: { i: number; state: FaState }[] = [];
      let currentTick: TraversalTick = [];
      for (const { i, state } of currentStates) {
        const c = str[i];
        nextStates = nextStates.concat(state.eTrans.map((st) => ({ i, state: st })));
        for (const st of state.eTrans) {
          currentTick.push({ state: st, from: state, accepting: isAccepting(st), i });
        }

        if (!c) continue;

        const nextState = state.trans[c] ?? state.trans["any"];
        if (nextState) {
          nextStates = nextStates.concat({ i: i + 1, state: nextState });
          currentTick.push({
            state: nextState,
            from: state,
            accepting: isAccepting(nextState),
            i: i + 1,
          });
        }
      }
      this.prevTraversal.push(currentTick);
      currentStates = nextStates;
    }
    // TODO okay maybe we don't want it to only match things that consume all characters
    this.prevTraversal.pop();
    const foundEnd = this.prevTraversal[this.prevTraversal.length - 1].some(
      (t) => t.accepting && t.i === str.length
    );
    if (!foundEnd) this.prevTraversal.push([]);
    return foundEnd;
  }
}

export const createState = (id: number): FaState => ({ id, trans: {}, eTrans: [] });
export const isAccepting = (state: FaState) =>
  state.eTrans.length === 0 && Object.keys(state.trans).length === 0;

const isMetaChar = (c: string) => c === "*" || c === "+" || c === "?";
