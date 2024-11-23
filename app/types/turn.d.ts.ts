// types/turn.js.d.ts
declare module 'turn.js' {
  export interface TurnSettings {
    width?: number;
    height?: number;
    autoCenter?: boolean;
    display?: 'single' | 'double';
    acceleration?: boolean;
    gradients?: boolean;
    elevation?: number;
  }

  interface JQuery {
    turn(settings?: TurnSettings): JQuery;
    turn(command: 'next'): JQuery;
    turn('previous'): JQuery;
  }
}