
export class InvalidTransitionError extends Error {
  constructor(from: string, to: string) {
    super(`Invalid transition from '${from}' to '${to}'`);
    this.name = "InvalidTransitionError";
  }
}

export class StateMachine<T extends string> {
  private transitions: Record<T, T[]>;

  constructor(transitions: Record<T, T[]>) {
    this.transitions = transitions;
  }

  canTransition(from: T, to: T): boolean {
    return this.transitions[from]?.includes(to) ?? false;
  }

  getAllowedTransitions(from: T): T[] {
    return this.transitions[from] ?? [];
  }

  transition(from: T, to: T): T {
    if (!this.canTransition(from, to)) {
      throw new InvalidTransitionError(from, to);
    }
    return to;
  }
}
