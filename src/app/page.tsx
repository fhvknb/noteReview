
'use client';

import {useState, useEffect} from 'react';
import {Note, getNotes} from '@/services/note-service';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {refineSummary} from '@/ai/flows/refine-summary';
import {useToast} from '@/hooks/use-toast';
import {Icons} from '@/components/icons';

const itemsPerPage = 5;

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showOriginal, setShowOriginal] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState<boolean>(true);
  const {toast} = useToast();

  useEffect(() => {
    const loadNotes = async () => {
      setLoading(true);
      try {
        const fetchedNotes = await getNotes();
        setNotes(fetchedNotes);
      } catch (error) {
        toast({
          title: 'Error fetching notes!',
          description: 'Failed to load notes from the database.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [toast]);

  useEffect(() => {
    // Apply category filter
    const newFilteredNotes = categoryFilter
      ? notes.filter(note => note.category.toLowerCase().includes(categoryFilter.toLowerCase()))
      : [...notes]; // Create a copy to avoid modifying the original array
    setFilteredNotes(newFilteredNotes);
    setCurrentPage(1); // Reset to the first page when the filter changes
  }, [notes, categoryFilter]);

  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);
  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleOriginalNote = (index: number) => {
    setShowOriginal(prevShowOriginal => ({
      ...prevShowOriginal,
      [index]: !prevShowOriginal[index],
    }));
  };

  const handleRefineSummary = async (index: number) => {
    const note = paginatedNotes[index];
    if (!note) return;

    try {
      const result = await refineSummary({
        originalNote: note.originalNote,
        currentSummary: note.summary,
      });

      const updatedNotes = notes.map(n =>
        n.originalNote === note.originalNote ? {...n, summary: result.refinedSummary} : n
      );
      setNotes(updatedNotes);

      toast({
        title: 'Summary Refined',
        description: 'The note summary has been successfully refined.',
      });
    } catch (error) {
      console.error('Error refining summary:', error);
      toast({
        title: 'Error',
        description: 'Failed to refine the summary.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Icons.spinner className="mr-2 h-8 w-8 animate-spin" />
        Loading notes...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Filter by category"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {paginatedNotes.map((note, index) => (
          <Card key={index} className="bg-secondary">
            <CardHeader>
              <CardTitle>Note {index + 1 + (currentPage - 1) * itemsPerPage}</CardTitle>
              <CardDescription>Category: {note.category}</CardDescription>
            </CardHeader>
            <CardContent>
              {note.summary}
              {showOriginal[index] && (
                <div className="mt-2 p-2 border rounded">
                  Original Note: {note.originalNote}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => toggleOriginalNote(index)}>
                {showOriginal[index] ? 'Hide Original' : 'Show Original'}
              </Button>
              <Button size="sm" onClick={() => handleRefineSummary(index)}>
                Refine Summary
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

