'use client';

import {useState, useEffect} from 'react';
import {Note, getNotes} from '@/services/note-service';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {useToast} from '@/hooks/use-toast';
import {Icons} from '@/components/icons';
import ReactMarkdown from 'react-markdown';

const itemsPerPage = 5;

// Custom component for rendering markdown headings
const MarkdownHeading = ({level, children}: { level: number, children: React.ReactNode }) => {
  const HeadingTag = `h${level}` as keyof React.ReactHTML;
  return <HeadingTag>{children}</HeadingTag>;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showOriginal, setShowOriginal] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState<boolean>(true);
  const {toast} = useToast();
  const [categoryTags, setCategoryTags] = useState<string[]>([]);

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
    // Extract category tags from notes
    const tags = new Set<string>();
    notes.forEach(note => {
      const firstCategoryWord = note.category.split('/')[0] || '';
      tags.add(firstCategoryWord);
    });
    setCategoryTags(Array.from(tags));
  }, [notes]);

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
      <div>
          {categoryTags.map(tag => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              className="mr-2 mb-2"
              onClick={() => setCategoryFilter(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {paginatedNotes.map((note, index) => (
          <Card key={note.id} className="bg-secondary">
            <CardHeader>
              <CardTitle>Note {index + 1 + (currentPage - 1) * itemsPerPage}</CardTitle>
              <CardDescription>
                {note.category.split('/').map((segment, index, array) => (
                  <span key={index}>
                    {segment}
                    {index < array.length - 1 && ' / '}
                  </span>
                ))}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Use custom rendering for headings */}
              <ReactMarkdown
              >
                {note.summary}
              </ReactMarkdown>

              {showOriginal[index] && (
                <div className="mt-2 pt-2 border-t-2 border-dashed">
                  <ReactMarkdown
                  >{note.originalNote}</ReactMarkdown>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-start space-x-2">
              <Button variant="outline" size="sm" onClick={() => toggleOriginalNote(index)}>
                {showOriginal[index] ? 'Hide Original' : 'Show Original'}
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
