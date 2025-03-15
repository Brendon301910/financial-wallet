export function handleSafeParseZod(result: any): Error {
  const errorMessage = result.error.issues
    .map((issue) => issue.message)
    .join(', '); // Concatena todas as mensagens de erro

  return new Error(errorMessage); // Retorna uma única mensagem de erro com as mensagens de validação
}
