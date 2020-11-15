/** Declara namespace do express para sobrescrever uma tipagem */
declare namespace Express {
  /** Adiciona informacao a Request (extende Request) */
  export interface Request {
    /** Define user dentro da request */
    user: {
      /** Define id dentro do user */
      id: string;
    };
  }
}
