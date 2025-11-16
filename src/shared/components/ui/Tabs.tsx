import { useState, ReactNode } from 'react';
import { cn } from '@/core/utils/cn';

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'line' | 'pills' | 'enclosed';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onChange?: (tabId: string) => void;
}

export function Tabs({
  tabs,
  defaultTab,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  onChange,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-2.5',
  };

  const variantStyles = {
    line: {
      container: 'border-b border-gray-200',
      tab: 'border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700',
      activeTab: 'border-blue-600 text-blue-600',
      spacing: '-mb-px',
    },
    pills: {
      container: 'bg-gray-100 rounded-lg p-1',
      tab: 'rounded-md hover:bg-gray-200',
      activeTab: 'bg-white text-blue-600 shadow-sm',
      spacing: '',
    },
    enclosed: {
      container: 'border-b border-gray-200',
      tab: 'border border-transparent rounded-t-lg hover:border-gray-300',
      activeTab: 'border-gray-300 border-b-white text-blue-600 bg-white',
      spacing: '-mb-px',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div>
      {/* Tab List */}
      <div className={cn('flex', fullWidth && 'w-full', styles.container)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'inline-flex items-center justify-center gap-2 font-medium transition-all',
              sizeClasses[size],
              styles.tab,
              styles.spacing,
              fullWidth && 'flex-1',
              activeTab === tab.id && styles.activeTab,
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(activeTab === tab.id ? 'block' : 'hidden')}
            role="tabpanel"
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}

