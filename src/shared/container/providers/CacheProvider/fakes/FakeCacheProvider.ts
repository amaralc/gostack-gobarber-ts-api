import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface ICacheData {
  [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
  /** Cria client do tipo Redis */
  private cache: ICacheData = {};

  public async save(key: string, value: string): Promise<void> {
    /** Salva par key, value no banco redis */
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    /** Busca valor no cach atraves da chave */
    const data = this.cache[key];

    /** Se nao encontrou data, retorna nulo */
    if (!data) {
      return null;
    }

    /** Converte string no tipo T */
    const parsedData = JSON.parse(data) as T;

    /** Retorna dado convertido */
    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    /** Deleta chave */
    delete this.cache[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    /** Encontra chaves com determinado prefixo */
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`),
    );

    /** Deleta chave de um prefixo */
    keys.forEach(key => {
      delete this.cache[key];
    });
  }
}
