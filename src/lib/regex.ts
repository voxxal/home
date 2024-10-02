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
export type NfaHead = {
  path: {
    state: FaState;
    i: number;
  }[];
  start: number;
};

export class Re {
  re: string;
  i: number;
  stateId: number;
  parenStack: "("[];
  parsed: TreeNode;
  nfaStructures: Required<FaState>[];
  nfa: FaState;
  nfaHeads: NfaHead[];
  nfaTicks: number;
  constructor(re: string) {
    this.re = re;
    this.i = 0;
    this.stateId = 1;
    this.parenStack = [];
    this.parsed = this.expr();
    this.nfaStructures = [];
    this.nfa = this.constructNfa(this.parsed);
    this.idNfa();
    this.nfaHeads = [];
    this.nfaTicks = -1;
  }

  atEnd() {
    return this.re.length === this.i;
  }

  peek() {
    return this.re[this.i];
  }

  has(c: string) {
    return this.re[this.i] === c;
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

  union(): TreeNode {
    const lhs = this.concat();
    if (!this.atEnd() && this.has("|")) {
      this.match("|");
      return { type: "union", lhs, rhs: this.union() };
    }

    return lhs;
  }

  concat(): TreeNode {
    const lhs = this.meta();
    if (this.has(")") && this.parenStack.length === 0) throw new Error("Unmatched )");
    if (!this.atEnd() && !this.has(")") && !this.has("|")) {
      const rhs = this.concat();
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
      this.parenStack.push("(");
      const exp = this.union();
      this.match(")");
      this.parenStack.pop();

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

    if (this.has("|")) throw new Error("Invaid union");

    if (this.has(")") && this.parenStack.length === 0) throw new Error("Unmatched )");

    return this.next();
  }

  coalesseEnds(state: Required<FaState>): FaState {
    if (state.ends.length === 1) {
      return state.ends[0];
    } else {
      const newEnd = createState();
      for (const end of state.ends) {
        end.eTrans.push(newEnd);
      }
      return newEnd;
    }
  }

  mergeNodes(lhs: FaState, rhs: FaState) {
    lhs.eTrans = [...lhs.eTrans, ...rhs.eTrans];
    const keys = new Set([...Object.keys(lhs.trans), ...Object.keys(rhs.trans)]);
    const newTrans: { [k: string]: FaState } = {};

    for (const key of keys.values()) {
      if (lhs.trans[key] && rhs.trans[key]) {
        this.mergeNodes(lhs.trans[key], rhs.trans[key]);
        newTrans[key] = lhs.trans[key];
      } else if (lhs.trans[key]) {
        newTrans[key] = lhs.trans[key];
      } else {
        newTrans[key] = rhs.trans[key];
      }
    }

    lhs.trans = newTrans;
    if (lhs.ends && rhs.ends) lhs.ends = [...lhs.ends, ...rhs.ends];
  }

  constructNfa(node: TreeNode): Required<FaState> {
    const res = this._constructNfa(node);
    if (!this.nfaStructures.includes(res)) this.nfaStructures.push(res);
    return res;
  }

  _constructNfa(node: TreeNode): Required<FaState> {
    if (typeof node === "string") {
      if (node === "") {
        return { id: -1, trans: {}, eTrans: [], ends: [] };
      }
      const id = -1;
      const end = createState();
      return { id, ends: [end], trans: { [node]: end }, eTrans: [] };
    }
    switch (node.type) {
      case "union": {
        const lhs = this.constructNfa(node.lhs);
        if (node.lhs === node.rhs) return lhs;
        // TODO this is a really bandaid fix to a|a
        // the fix is probably function to merge transisitions that fixes up any nodes

        const rhs = this.constructNfa(node.rhs);
        this.nfaStructures.pop();

        this.mergeNodes(lhs, rhs);
        return lhs;
      }
      case "concat": {
        const lhs = this.constructNfa(node.lhs);
        // TODO coalesse ends if there is only one transition from the next node
        const newEnd = this.coalesseEnds(lhs);
        const rhs = this.constructNfa(node.rhs);
        this.nfaStructures.pop();
        newEnd.trans = rhs.trans;
        newEnd.eTrans = rhs.eTrans;
        lhs.ends = rhs.ends;

        return lhs;
      }
      case "meta": {
        const op = node.rhs as "?" | "*" | "+";
        if (op === "?") {
          const lhs = this.constructNfa(node.lhs);
          const end = createState();
          lhs.ends.push(end);
          lhs.eTrans.push(end);
          return lhs;
        } else if (op === "*") {
          const loopNode = createState();
          const lhs = this.constructNfa(node.lhs);
          const newEnd = this.coalesseEnds(lhs);
          const accepting = createState();
          loopNode.eTrans.push(lhs);
          loopNode.eTrans.push(accepting);
          loopNode.ends = [accepting];
          newEnd.eTrans.push(loopNode);
          return loopNode as Required<FaState>;
        } else if (op === "+") {
          const lhs = this.constructNfa(node.lhs);
          const newEnd = this.coalesseEnds(lhs);
          const loopNode = createState();
          const accepting = createState();
          loopNode.eTrans.push(lhs);
          loopNode.eTrans.push(accepting);
          lhs.ends = [accepting];
          newEnd.eTrans.push(loopNode);
          return lhs;
        }
      }
    }
  }

  idNfa() {
    this.nfa.id = 0;
    for (const structure of this.nfaStructures) {
      this.idNfaState(structure, structure.ends, structure.id === 0);
    }
  }

  idNfaState(state: FaState, ends: FaState[], mainProcess: boolean = false) {
    if (state.id === -1) state.id = this.stateId++;
    else if (!mainProcess) {
      // The process of the 0 node must stay a normal process even though it starts with an id
      if (state.ends) {
        for (const end of state.ends) {
          this.idNfaState(end, ends);
        }
      } else {
        for (const next of state.eTrans) {
          this.idNfaState(next, ends);
        }

        for (const next of Object.values(state.trans)) {
          this.idNfaState(next, ends);
        }
      }
      return;
    }
    if (ends.includes(state)) return;
    for (const next of state.eTrans) {
      this.idNfaState(next, ends);
    }

    for (const next of Object.values(state.trans)) {
      this.idNfaState(next, ends);
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

  matchNfa(str: string): boolean {
    this.nfaHeads = [{ path: [{ state: this.nfa, i: 0 }], start: 0 }];
    const heads = this.nfaHeads;
    let currentStates = [{ i: 0, id: 0, state: this.nfa }];
    let tick = 0;
    let headId = 1;

    while (currentStates.length !== 0) {
      // && !currentStates.some(({state, i}) => isAccepting(state) && i === str.length)
      tick++;
      let nextStates: { i: number; state: FaState; id: number }[] = [];
      for (const { id, i, state } of currentStates) {
        const c = str[i];
        let extendedNode = false;
        for (const st of state.eTrans) {
          let newId = extendedNode ? headId++ : ((extendedNode = true), id);
          nextStates.push({ i, state: st, id: newId });
          heads[newId] ??= { path: [{ state, i }], start: tick - 1 };
          heads[newId].path.push({ state: st, i });
        }
        if (!c) continue;

        const nextState = state.trans[c] ?? state.trans["any"];
        if (nextState) {
          let newId = extendedNode ? headId++ : ((extendedNode = true), id);
          nextStates.push({ i: i + 1, state: nextState, id: newId });
          heads[newId] ??= { path: [{ state, i }], start: tick - 1 };
          heads[newId].path.push({ state: nextState, i: i + 1 });
        }
      }
      // this.prevTraversal.push(currentTick);
      currentStates = nextStates;
    }
    console.log(heads);
    // TODO okay maybe we don't want it to only match things that consume all characters
    const accepted = heads
      .map(({ path }) => path[path.length - 1])
      .some(({ state, i }) => i === str.length && isAccepting(state));
    this.nfaTicks = tick + +!accepted;
    return accepted;
    // this.prevTraversal.pop();
    // const foundEnd = this.prevTraversal[this.prevTraversal.length - 1].some(
    //   (t) => t.accepting && t.i === str.length
    // );
    // if (!foundEnd) this.prevTraversal.push([]);
    // return foundEnd;
  }
}

export const createState = (): FaState => ({ id: -1, trans: {}, eTrans: [] });
export const isAccepting = (state: FaState) =>
  state.eTrans.length === 0 && Object.keys(state.trans).length === 0;

const isMetaChar = (c: string) => c === "*" || c === "+" || c === "?";
