export default class Error {
  /** Define mensagem de erro como propriedade publica e read only */
  public readonly message: string;

  /** Define status do erro como propriedade publica e read only */
  public readonly statusCode: number;

  /** Inicializa instancia com mensagem tipo string e status com numero padrao */
  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
