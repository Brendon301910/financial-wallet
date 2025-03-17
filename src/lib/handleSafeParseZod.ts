export function handleSafeParseZod(result: any): Error {
  const errorMessage = result.error.issues
    .map((issue) => issue.message)
    .join(', ');

  return new Error(errorMessage);
}
