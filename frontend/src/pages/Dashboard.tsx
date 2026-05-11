import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadDropzone } from '../components/UploadDropzone';
import { FacebookConnectModal } from '../components/FacebookConnectModal';
import { ListingReviewCard } from '../components/ListingReviewCard';
import { DraftsGrid } from '../components/DraftsGrid';
import { HowToGuide } from '../components/HowToGuide';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


export interface AnalyzedData {
// ... keep AnalyzedData intact
  imageUrl: string;
  visionData: {
    item_name: string;
    brand: string;
    model: string;
    condition_assessment: string;
    category: string;
  };
  pricingData: {
    medianPrice: number;
    priceRange: { low: number; high: number };
    suggestedPrice: number;
  };
  listing: {
    title: string;
    description: string;
  };
}

type TabType = 'create' | 'drafts' | 'guide';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('create');
  const [step, setStep] = useState<1 | 2>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<AnalyzedData | null>(null);
  const navigate = useNavigate();

// ... keep handleLogout and handleImageSelect
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleImageSelect = async (file: File) => {
    setIsAnalyzing(true);
    setStep(1);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      const result = await response.json();
      if (result.success) {
        setData(result.data);
        setStep(2);
      } else {
        alert('Analysis failed: ' + result.error);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Network error analyzing image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark dark:bg-background dark:text-foreground font-sans antialiased flex flex-col">
      <header className="border-b border-primary bg-background shadow-[0_0_15px_rgba(0,255,255,0.3)] sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center glow-border">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight glow-text uppercase hidden sm:block">Meta-Place-Lister 9,000</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <FacebookConnectModal />
            <button onClick={handleLogout} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 border-b border-primary/20 flex gap-4 sm:gap-8 overflow-x-auto whitespace-nowrap">
        <button 
          onClick={() => setActiveTab('create')} 
          className={`font-bold uppercase tracking-widest pb-2 border-b-2 transition-colors ${activeTab === 'create' ? 'border-primary text-primary glow-text' : 'border-transparent text-muted-foreground hover:text-primary'}`}
        >
          Create
        </button>
        <button 
          onClick={() => setActiveTab('drafts')} 
          className={`font-bold uppercase tracking-widest pb-2 border-b-2 transition-colors ${activeTab === 'drafts' ? 'border-primary text-primary glow-text' : 'border-transparent text-muted-foreground hover:text-primary'}`}
        >
          My Drafts
        </button>
        <button 
          onClick={() => setActiveTab('guide')} 
          className={`font-bold uppercase tracking-widest pb-2 border-b-2 transition-colors ${activeTab === 'guide' ? 'border-primary text-primary glow-text' : 'border-transparent text-muted-foreground hover:text-primary'}`}
        >
          How It Works
        </button>
      </div>

      <main className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        {activeTab === 'create' && (
          <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase glow-text leading-tight">
                Turn Photos into <br className="sm:hidden" /><span className="text-primary">Listings</span>
              </h2>
              <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                Drop an image and let our AI agents identify the item, research market prices, and write a high-converting Facebook Marketplace listing.
              </p>
            </div>

            {step === 1 && (
              <UploadDropzone onFileSelect={handleImageSelect} isAnalyzing={isAnalyzing} />
            )}

            {step === 2 && data && (
              <ListingReviewCard initialData={data} onCancel={() => setStep(1)} />
            )}
          </div>
        )}

        {activeTab === 'drafts' && (
          <div className="w-full mx-auto space-y-8">
            <DraftsGrid />
          </div>
        )}

        {activeTab === 'guide' && (
          <HowToGuide />
        )}
      </main>
    </div>
  );
}
