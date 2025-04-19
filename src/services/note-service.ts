/**
 * Represents a note with its category, original content, and summary.
 */
export interface Note {
  /**
   * The category of the note.
   */
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
  // TODO: Implement this by calling an external API.
  
  const stubbedNotes: Note[] = [
    {
      category: 'Meeting',
      originalNote: 'Discussed project timelines and resource allocation.',
      summary: 'Project timeline and resource discussion summary.'
    },
    {
      category: 'Research',
      originalNote: 'Explored new methodologies for data analysis.',
      summary: 'Data analysis methodologies exploration summary.'
    },
    {
      category: 'Personal',
      originalNote: 'Things to buy from the grocery store.',
      summary: 'List of grocery items.'
    }
  ];
  
  return stubbedNotes;
}
