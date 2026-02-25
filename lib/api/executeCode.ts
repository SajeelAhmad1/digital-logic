export async function executeCode(code: string, language: string): Promise<string> {
  const res = await fetch('/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language }),
  });

  const data = await res.json();

  if (!res.ok) return `Error: ${data.error ?? 'Execution failed.'}`;
  return data.output ?? '(no output)';
}