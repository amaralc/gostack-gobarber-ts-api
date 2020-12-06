/** Cria interface com quantidade variavel de elementos */
interface ITemplateVariables {
  /** Define propriedade que tem chave do tipo string */
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}
