import React from 'react';
import { RefreshCw, LayoutDashboard } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';

const Header: React.FC = () => {
  const [syncing, setSyncing] = React.useState(false);
  const syncWithClickUp = useTaskStore(state => state.syncWithClickUp);
  const clickUpConfig = useTaskStore(state => state.clickUpConfig);

  const handleSync = async () => {
    if (!clickUpConfig) return;
    setSyncing(true);
    try {
      await syncWithClickUp();
    } finally {
      setSyncing(false);
    }
  };

  return (
    <header className="border-b border-white/10 bg-surface/30">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center">
            {clickUpConfig && (
              <button
                onClick={handleSync}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface hover:bg-surface-hover text-text-secondary hover:text-white transition-colors ${syncing ? 'animate-spin' : ''}`}
                title="Sync with ClickUp"
              >
                <RefreshCw className="h-4 w-4" /> 
                <span className="text-sm">Sync</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;