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

export async function POST(request: Request) {
  try {
    await initDatabase();
    const { category, originalNote, summary } = await request.json();

    // Validate the data
    if (!category || !originalNote || !summary) {
      return new NextResponse(JSON.stringify({ message: "Missing required fields." }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // Insert the new note into the database
    const insertQuery = `
      INSERT INTO notes (category, originalNote, summary)
      VALUES (?, ?, ?)
    `;
    const insertValues = [category, originalNote, summary];

    await query(insertQuery, insertValues);

    return new NextResponse(JSON.stringify({ message: "Note saved successfully." }), {
      status: 201,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Failed to save note:", error);
    return new NextResponse(JSON.stringify({ message: "Failed to save note." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}

