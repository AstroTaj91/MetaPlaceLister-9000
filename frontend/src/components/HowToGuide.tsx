

export function HowToGuide() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 bg-muted/10 p-6 sm:p-10 rounded-2xl border border-primary/20 shadow-lg">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold glow-text uppercase tracking-tight">How It Works</h2>
        <p className="text-muted-foreground text-lg">Master the cross-device automation workflow.</p>
      </div>

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/50 before:to-transparent">
        
        {/* Step 1 */}
        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(0,255,255,0.5)] z-10">
            1
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-primary/20 bg-background/50 backdrop-blur-sm tron-card shadow-md">
            <div className="flex items-center mb-1">
              <h3 className="font-bold text-lg glow-text">Mobile Generation</h3>
            </div>
            <div className="text-muted-foreground text-sm">
              Take your phone into your warehouse or garage. Log into this portal, switch to the "Create" tab, and snap photos of your items.
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(0,255,255,0.5)] z-10">
            2
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-primary/20 bg-background/50 backdrop-blur-sm tron-card shadow-md">
            <div className="flex items-center mb-1">
              <h3 className="font-bold text-lg glow-text">Save to Drafts</h3>
            </div>
            <div className="text-muted-foreground text-sm">
              Our AI automatically identifies the item, researches the price, and writes the SEO listing. Click <strong>"Save to Drafts"</strong> instead of publishing.
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(0,255,255,0.5)] z-10">
            3
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-primary/20 bg-background/50 backdrop-blur-sm tron-card shadow-md">
            <div className="flex items-center mb-1">
              <h3 className="font-bold text-lg glow-text">Desktop Connection</h3>
            </div>
            <div className="text-muted-foreground text-sm">
              Later, sit down at your desktop computer. Click the <strong>"Connect Facebook"</strong> button at the top right and paste your session cookies using the extension.
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(0,255,255,0.5)] z-10">
            4
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-primary/20 bg-background/50 backdrop-blur-sm tron-card shadow-md">
            <div className="flex items-center mb-1">
              <h3 className="font-bold text-lg glow-text">Bulk Publish</h3>
            </div>
            <div className="text-muted-foreground text-sm">
              Switch to the <strong>"My Drafts"</strong> tab. You will see all the items you scanned from your phone. Click <strong>Publish Now</strong> on each one to let the Playwright bot do the heavy lifting!
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
