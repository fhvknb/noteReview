'use server';

import {NextResponse} from 'next/server';
import {query, initDatabase} from '@/lib/mysql';

export async function GET() {
  try {
    await initDatabase();
    const notes = await query('SELECT * FROM notes');
    return NextResponse.json(notes);
  } catch (error) {
    console.error("Failed to fetch note data:", error);
    return new NextResponse(JSON.stringify({ message: "Failed to retrieve note data." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}

