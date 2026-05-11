import { useState } from 'react';
import { Link, ShieldCheck, Loader2, CheckCircle, ShieldAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from './ui/textarea';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


export function FacebookConnectModal() {
  const [open, setOpen] = useState(false);
  const [cookiesStr, setCookiesStr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      let parsedCookies;
      try {
        parsedCookies = JSON.parse(cookiesStr);
      } catch (e) {
        throw new Error('Invalid JSON format. Please paste the exact JSON array exported from your extension.');
      }

      const response = await fetch(`${API_URL}/api/auth/facebook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookies: parsedCookies }),
      });

      const result = await response.json();
      
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => setOpen(false), 2000);
      } else {
        setError(result.error || 'Failed to securely store cookies.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* @ts-ignore */}
      <DialogTrigger asChild>
        <Button variant={isSuccess ? "secondary" : "default"} className="font-bold tracking-widest uppercase glow-border border border-primary/50 shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all">
          <ShieldAlert className="w-4 h-4 mr-2" />
          {isSuccess ? 'Connected' : 'Connect Facebook'}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[550px] max-h-[90vh] overflow-y-auto tron-card rounded-lg p-4 sm:p-6" aria-describedby="facebook-connect-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 glow-text text-lg sm:text-xl">
            <Link className="text-primary shrink-0" />
            Connect Account
          </DialogTitle>
          <DialogDescription id="facebook-connect-description" className="text-muted-foreground pt-1 sm:pt-2 text-sm">
            To automate posting, we need your active session.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          
          <div className="bg-muted/30 border border-primary/20 p-4 rounded-lg space-y-3">
            <h4 className="font-semibold glow-text text-sm uppercase tracking-wider">How to get your cookies:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground font-medium">
              <li>Install the <a href="https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm" target="_blank" rel="noreferrer" className="text-primary hover:underline">Cookie-Editor extension</a>.</li>
              <li>Go to <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">Facebook.com</a> and log into your account.</li>
              <li>Click the Cookie-Editor icon in your browser toolbar.</li>
              <li>Click the <strong>Export</strong> button <span className="inline-block bg-muted px-1 rounded text-xs">➔</span> (this copies the cookies as JSON to your clipboard).</li>
              <li>Paste the contents into the secure box below.</li>
            </ol>
          </div>

          <div className="bg-muted p-3 rounded-lg flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5 glow-text" />
            <div className="text-xs text-muted-foreground leading-tight">
              <strong className="text-foreground block mb-1">AES-256 Encryption Active</strong>
              Your session cookies are immediately encrypted by our backend and wiped from memory after posting.
            </div>
          </div>
          
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 text-green-500">
              <CheckCircle className="w-12 h-12 mb-2 glow-text" />
              <p className="font-semibold glow-text">Session Securely Stored!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Textarea 
                placeholder='Paste the exported JSON array here... e.g. [{"domain": ".facebook.com", ...}]'
                rows={4}
                value={cookiesStr}
                onChange={(e) => setCookiesStr(e.target.value)}
                className="font-mono text-[10px] sm:text-xs bg-background/50 border-primary/30 focus-visible:ring-primary/50"
              />
              {error && <p className="text-sm text-destructive font-medium">{error}</p>}
              <Button onClick={handleConnect} disabled={isLoading || !cookiesStr} className="w-full h-12 sm:h-10 text-base sm:text-sm font-bold tracking-wide" aria-label="Encrypt and Save Cookies">
                {isLoading ? <Loader2 className="w-5 h-5 sm:w-4 sm:h-4 mr-2 animate-spin" /> : null}
                Encrypt & Connect
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
