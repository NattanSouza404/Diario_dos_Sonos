import { primeiraLetraMaiuscula } from "@/utils/FormatadorUtils";

describe('FormatadorUtils', () => {
  test('deve capitalizar a primeira letra corretamente', () => {
    const texto = 'exemplo de texto';
    const resultado = primeiraLetraMaiuscula(texto);

    expect(resultado).toBe('Exemplo de texto');
  });

  test('deve retornar string vazia quando input for string vazia', () => {
    const texto = '';
    const resultado = primeiraLetraMaiuscula(texto);

    expect(resultado).toBe('');
  });
});