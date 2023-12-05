export async function timeFnExecution<T extends () => U, U = unknown>(func: T, label: string): Promise<U> {
  console.time(label);
  const result = await func();
  console.timeEnd(label);

  return result;
}
