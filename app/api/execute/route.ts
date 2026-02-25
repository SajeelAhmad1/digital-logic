// app/api/execute/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Judge0 CE via RapidAPI — free tier: 50 req/day
// Get your key: https://rapidapi.com/judge0-official/api/judge0-ce
const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com/submissions';
const RAPIDAPI_KEY = process.env.JUDGE0_API_KEY!;

// Judge0 language IDs
const LANGUAGE_IDS: Record<string, number> = {
  java:       62,  // Java (OpenJDK 13)
  python:     71,  // Python 3.8
  javascript: 63,  // JavaScript (Node.js 12)
  cpp:        54,  // C++ (GCC 9.2)
};

export async function POST(req: NextRequest) {
  const { code, language } = await req.json();

  if (!code || !language) {
    return NextResponse.json({ error: 'code and language are required.' }, { status: 400 });
  }

  const languageId = LANGUAGE_IDS[language];
  if (!languageId) {
    return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
  }

  try {
    // Step 1: Submit code
    const submitRes = await fetch(`${JUDGE0_URL}?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: '',
      }),
    });

    if (!submitRes.ok) {
      const text = await submitRes.text();
      console.error('Judge0 error:', submitRes.status, text);
      return NextResponse.json({ error: `Execution API returned ${submitRes.status}` }, { status: 502 });
    }

    const result = await submitRes.json();

    // status 3 = Accepted, 4 = Wrong Answer, 5 = TLE, 6 = CE, 11 = RE, etc.
    const stdout = result.stdout ?? '';
    const stderr = result.stderr ?? '';
    const compileOutput = result.compile_output ?? '';
    const statusDesc = result.status?.description ?? '';

    // Compile error
    if (compileOutput) {
      return NextResponse.json({ output: `Compile Error:\n${compileOutput}` });
    }

    // Runtime error
    if (stderr) {
      return NextResponse.json({ output: `${stderr}` });
    }

    // Success
    if (stdout) {
      return NextResponse.json({ output: stdout });
    }

    // Other statuses (TLE, MLE, etc.)
    if (statusDesc && statusDesc !== 'Accepted') {
      return NextResponse.json({ output: `Status: ${statusDesc}` });
    }

    return NextResponse.json({ output: '(no output)' });

  } catch (err: any) {
    console.error('Execute proxy error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}