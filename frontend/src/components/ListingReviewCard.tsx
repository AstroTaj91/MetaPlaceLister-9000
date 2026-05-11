import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Send, Tag, Loader2, CheckCircle } from 'lucide-react';
import { AnalyzedData } from '../pages/Dashboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


interface Props {
  initialData: AnalyzedData;
  onCancel: () => void;
}

export function ListingReviewCard({ initialData, onCancel }: Props) {
  const [title, setTitle] = useState(initialData.listing.title);
  const [price, setPrice] = useState(initialData.pricingData.suggestedPrice.toString());
  const [description, setDescription] = useState(initialData.listing.description);
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state if initialData changes
  useEffect(() => {
    setTitle(initialData.listing.title);
    setPrice(initialData.pricingData.suggestedPrice.toString());
    setDescription(initialData.listing.description);
    setIsPublishing(false);
    setIsSuccess(false);
    setError(null);
  }, [initialData]);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          suggestedPrice: parseInt(price, 10),
          imageUrl: initialData.imageUrl,
          status: 'draft',
          category: initialData.visionData.category
        })
      });

      const result = await response.json();
      if (result.success) {
        onCancel(); // Use this to go back to dropzone
      } else {
        setError(result.error || 'Failed to save draft');
      }
    } catch (err) {
      console.error(err);
      setError('Network error saving draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/publish`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          price,
          description,
          category: initialData.visionData.category,
          imageUrl: initialData.imageUrl
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || 'Failed to publish to Facebook.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during publishing.');
    } finally {
      setIsPublishing(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="tron-card w-full max-w-2xl mx-auto shadow-lg text-center py-12" aria-label="Publish Success">
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 glow-text" />
          <h2 className="text-2xl font-bold glow-text">Successfully Published!</h2>
          <p className="text-muted-foreground">Your item has been posted to Facebook Marketplace.</p>
          <Button onClick={onCancel} className="mt-4">Start New Listing</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="tron-card w-full max-w-2xl mx-auto shadow-lg" aria-label="Listing Review Card">
      <CardHeader className="bg-muted/50 border-b border-primary/30">
        <CardTitle className="flex justify-between items-center">
          <span>Review Your Listing</span>
          <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
            <Tag className="w-4 h-4" />
            {initialData.visionData.category}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label htmlFor="listing-title">Title</Label>
          <Input 
            id="listing-title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            aria-label="Edit listing title"
            className="font-medium text-lg"
            disabled={isPublishing}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="listing-price">Suggested Price ($)</Label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <Input 
              id="listing-price" 
              type="number"
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              aria-label="Edit listing price"
              className="text-lg font-semibold text-green-600 dark:text-green-400 w-1/2 sm:w-1/3"
              disabled={isPublishing}
            />
            <p className="text-xs text-muted-foreground">
              Market Range: ${initialData.pricingData.priceRange.low} - ${initialData.pricingData.priceRange.high}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="listing-description">Description</Label>
          <Textarea 
            id="listing-description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            rows={8}
            aria-label="Edit listing description"
            disabled={isPublishing}
          />
        </div>

        {error && <p className="text-destructive text-sm font-medium">{error}</p>}
      </CardContent>
      <CardFooter className="bg-muted/50 border-t border-primary/30 py-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isPublishing || isSaving} aria-label="Cancel listing generation" className="w-full sm:w-auto">Cancel</Button>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <Button variant="secondary" onClick={handleSaveDraft} disabled={isPublishing || isSaving} className="w-full sm:w-auto flex items-center gap-2 font-bold tracking-wide" aria-label="Save listing to drafts">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save to Drafts
          </Button>
          <Button onClick={handlePublish} disabled={isPublishing || isSaving} className="w-full sm:w-auto flex items-center gap-2 font-bold tracking-wide" aria-label="Publish to Facebook Marketplace">
            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isPublishing ? 'Publishing Bot Running...' : 'Publish to Facebook'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
