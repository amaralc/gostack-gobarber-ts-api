import handlebars from 'handlebars';
import fs from 'fs';

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({
    file,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    /** Pega conteúdo de arquivo */
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    /** Decodifica arquivo */
    const parseTemplate = handlebars.compile(templateFileContent);

    /** Retorna parsed template com variaveis */
    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
