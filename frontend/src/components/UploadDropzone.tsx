import React, { useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface Props {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export function UploadDropzone({ onFileSelect, isAnalyzing }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <Card 
      className={`tron-card border-2 border-dashed transition-all duration-200 ${isDragging ? 'border-primary bg-primary/20' : 'border-primary/50'}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      aria-label="Upload item image dropzone"
      role="button"
      tabIndex={0}
    >
      <CardContent className="flex flex-col items-center justify-center py-12 sm:py-20 text-center cursor-pointer px-4">
        {isAnalyzing ? (
          <>
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" aria-hidden="true" />
            <h3 className="text-2xl font-semibold mb-2 text-primary">Analyzing item...</h3>
            <p className="text-muted-foreground mb-6">Identifying item, extracting features, and researching market prices.</p>
          </>
        ) : (
          <>
            <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" aria-hidden="true" />
            <h3 className="text-2xl font-semibold mb-2">Drag & Drop your item photo</h3>
            <p className="text-muted-foreground mb-6">Or click to browse your files</p>
            <label className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium cursor-pointer transition-colors">
              Select Image
              <input type="file" className="hidden" accept="image/*" onChange={handleChange} aria-label="Select an image file to upload" />
            </label>
          </>
        )}
      </CardContent>
    </Card>
  );
}
