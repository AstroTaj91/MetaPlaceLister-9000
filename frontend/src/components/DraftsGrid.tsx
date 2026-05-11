import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Loader2, Send } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


interface ListingDraft {
  id: string;
  title: string;
  description: string;
  suggestedPrice: number;
  imageUrl: string;
  status: string;
}

export function DraftsGrid() {
  const [drafts, setDrafts] = useState<ListingDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/listings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setDrafts(result.data.filter((d: ListingDraft) => d.status === 'draft'));
      }
    } catch (err) {
      console.error('Failed to fetch drafts', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (draft: ListingDraft) => {
    setPublishingId(draft.id);
    try {
      const token = localStorage.getItem('token');
      // In a real app we might pass the image to Playwright via path or URL
      // Since Playwright runs on the backend, we just send the draft data
      const response = await fetch(`${API_URL}/api/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: draft.title,
          price: draft.suggestedPrice.toString(),
          description: draft.description,
          category: 'Other', // or save category in DB
          imageUrl: draft.imageUrl
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Successfully published!');
        fetchDrafts(); // refresh
      } else {
        alert(result.error || 'Failed to publish');
      }
    } catch (err) {
      alert('Error publishing draft');
    } finally {
      setPublishingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/20 border border-dashed border-primary/30 rounded-xl">
        <p className="text-muted-foreground">No drafts found. Switch to the Create tab to scan items!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {drafts.map((draft) => (
        <Card key={draft.id} className="tron-card flex flex-col overflow-hidden">
          <div className="h-48 w-full bg-muted/30 overflow-hidden">
            {draft.imageUrl ? (
              <img src={draft.imageUrl} alt={draft.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
            )}
          </div>
          <CardContent className="flex-1 p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-bold text-lg line-clamp-2 leading-tight">{draft.title}</h3>
              <span className="font-bold text-green-500 whitespace-nowrap">${draft.suggestedPrice}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">{draft.description}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 border-t border-primary/20 bg-muted/10 mt-auto">
            <Button 
              className="w-full font-bold tracking-wide mt-4" 
              onClick={() => handlePublish(draft)}
              disabled={publishingId === draft.id}
            >
              {publishingId === draft.id ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> Publish Now</>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
