'use server';

import { NextResponse } from 'next/server';
import { query, initDatabase } from '@/lib/mysql';

export async function GET() {
  try {
    await initDatabase();
    const notes = await query('SELECT * FROM notes ORDER BY `id` desc');
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
    const { category, originalNote, summary, title, id } = await request.json();


    if (request.headers.get("authorization") !== `Bearer ${process.env.ZY_TOKEN}`) {
      return new NextResponse(JSON.stringify({ message: "The Request is forbidden!" }), {
        status: 403,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // Validate the data
    if (!category || !originalNote || !summary || !title || !id) {
      return new NextResponse(JSON.stringify({ message: "Missing required fields." }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // find note by id

    const queryById = `
      SELECT id FROM notes WHERE \`id\` = ?
      `


    const findNote = await query(queryById, [id]) as {id: number}[];

    if(findNote.length) {
      return new NextResponse(JSON.stringify({ code: 0, message: "Note has exists." }), {
        status: 201,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // Insert the new note into the database
    const insertQuery = `
      INSERT INTO notes (id, category, title, originalNote, summary)
      VALUES (?, ?, ?, ?, ?)
    `;
    const insertValues = [id, category, title, originalNote, summary];

    await query(insertQuery, insertValues);

    return new NextResponse(JSON.stringify({ code: 0, message: "Note saved successfully." }), {
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

