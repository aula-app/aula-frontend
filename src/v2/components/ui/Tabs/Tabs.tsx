import { useId, useRef } from 'react';
import Icon, { ICON_TYPE } from '@/components/new/Icon/Icon';

export interface TabDefinition<T extends string> {
  value: T;
  label: string;
  icon?: ICON_TYPE;
  panel: React.ReactNode;
}

interface Props<T extends string> {
  tabs: TabDefinition<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the tab list. */
  label: string;
  className?: string;
  'data-testid'?: string;
}

const Tabs = <T extends string>({ tabs, value, onChange, label, className = '', 'data-testid': testId }: Props<T>) => {
  const id = useId();
  const strip = useRef<HTMLDivElement>(null);
  const current = tabs.findIndex((tab) => tab.value === value);
  const active = tabs[current] ?? tabs[0];

  const tabId = (tab: TabDefinition<T>) => `${id}-${tab.value}`;
  const panelId = (tab: TabDefinition<T>) => `${id}-${tab.value}-panel`;

  const step = (key: string): number | null => {
    switch (key) {
      case 'ArrowRight':
        return (current + 1) % tabs.length;
      case 'ArrowLeft':
        return (current - 1 + tabs.length) % tabs.length;
      case 'Home':
        return 0;
      case 'End':
        return tabs.length - 1;
      default:
        return null;
    }
  };

  const walk = (event: React.KeyboardEvent) => {
    const next = step(event.key);

    if (next === null) return;

    event.preventDefault();
    onChange(tabs[next].value);
    strip.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div
        ref={strip}
        role="tablist"
        aria-label={label}
        className="flex gap-1 border-b border-current/15"
        onKeyDown={walk}
        data-testid={testId}
      >
        {tabs.map((tab) => {
          const selected = tab.value === active?.value;

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              id={tabId(tab)}
              aria-selected={selected}
              aria-controls={panelId(tab)}
              tabIndex={selected ? 0 : -1}
              className={`-mb-px flex cursor-pointer items-center gap-2 rounded-t-xl border-b-2 px-4 py-2 transition-colors ${
                selected
                  ? 'border-current font-bold'
                  : 'border-transparent opacity-70 hover:bg-current/5 hover:opacity-100'
              }`}
              onClick={() => onChange(tab.value)}
              data-testid={testId ? `${testId}-${tab.value}` : undefined}
            >
              {!!tab.icon && <Icon type={tab.icon} size="1.2em" className="shrink-0" />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {!!active && (
        <div role="tabpanel" id={panelId(active)} aria-labelledby={tabId(active)} tabIndex={0}>
          {active.panel}
        </div>
      )}
    </div>
  );
};

export default Tabs;
