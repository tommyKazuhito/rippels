declare class Stats {
  REVISION: number;

  dom: HTMLDivElement;

  /**
   * @param value 0:fps, 1: ms, 2: mb, 3+: custom
   */
  showPanel(value: number): void;

  begin(): void;

  end(): number;

  update(): void;
}

declare module 'stats-js' {
  export = Stats;
}
