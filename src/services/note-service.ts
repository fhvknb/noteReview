/**
 * Represents a note with its category, original content, and summary.
 */
export interface Note {
  /**
   * The category of the note.
   */
  id: number;
  title: string;
  category: string;
  /**
   * The original content of the note.
   */
  originalNote: string;
  /**
   * A summary of the note.
   */
  summary: string;
}

/**
 * Asynchronously retrieves a list of notes, optionally filtered by category.
 * @param category Optional category to filter notes by.
 * @returns A promise that resolves to an array of Note objects.
 */

export async function getNotes(category?: string): Promise<Note[]> {

  const res = await fetch('/api/notes');
  return res.json() as Promise<Note[]>;
}

    
