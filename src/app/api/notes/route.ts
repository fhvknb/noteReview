'use server';

import {NextResponse} from 'next/server';
import {query, initDatabase} from '@/lib/mysql';

export async function GET() {
  try {
    await initDatabase();
    const notes = await query('SELECT * FROM notes');
    return NextResponse.json(notes);
  } catch (error) {
    console.error("노트 데이터 가져오기 실패:", error);
    return new NextResponse(JSON.stringify({ message: "노트 데이터를 가져오는데 실패했습니다." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
