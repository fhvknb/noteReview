'use server';

import {getNotes} from '@/services/note-service';
import {NextResponse} from 'next/server';

export async function GET() {
  const notes = await getNotes();
  return NextResponse.json(notes);
}
