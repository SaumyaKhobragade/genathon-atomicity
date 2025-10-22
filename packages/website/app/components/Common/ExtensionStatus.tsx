import React from 'react';
import { AlertCircle, CheckCircle2, Download } from 'lucide-react';

interface ExtensionStatusProps {
  isAvailable: boolean;
  isLoading: boolean;
  itemCount?: number;
  storageUsed?: number;
}

export const ExtensionStatus: React.FC<ExtensionStatusProps> = ({
  isAvailable,
  isLoading,
  itemCount = 0,
  storageUsed = 0,
}) => {
  if (isLoading) {
    return null;
  }

  if (!isAvailable) {
    return (
      <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="size-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">
              Extension Not Connected
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              To see your captured memories, make sure the Sparky extension is:
            </p>
            <ul className="text-sm text-amber-700 dark:text-amber-300 mt-2 ml-4 space-y-1 list-disc">
              <li>Installed in your browser</li>
              <li>Enabled in chrome://extensions/</li>
              <li>Has captured some content</li>
            </ul>
            <div className="mt-3 flex gap-2">
              <a
                href="/extension"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                <Download className="size-4" />
                Get Extension
              </a>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100 text-sm font-medium rounded-md hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="size-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-green-900 dark:text-green-100">
            Extension Connected
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
            Syncing {itemCount} memor{itemCount === 1 ? 'y' : 'ies'} • 
            {' '}{storageUsed.toFixed(2)} MB used
          </p>
        </div>
      </div>
    </div>
  );
};
