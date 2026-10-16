import useIsDrawerMode from '@/v2/hooks/useIsDrawerMode';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useSidebarItems } from './useSidebarItems';

interface UseSideBarOptions {
  onClose?: () => void;
}

export function useSideBar({ onClose }: UseSideBarOptions) {
  const { t } = useTranslation();
  const items = useSidebarItems();
  const { pathname } = useLocation();
  const isDrawerMode = useIsDrawerMode();

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') { onClose?.(); document.getElementById('main-content')?.focus(); return; }
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;

    const nav = e.currentTarget;
    const active = document.activeElement as HTMLElement;

    const sec = (name: string) => nav.querySelector<HTMLElement>(`[data-nav-section="${name}"]`);
    const focusable = (section: HTMLElement | null): HTMLElement[] =>
      Array.from(section?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []).filter(
        (el) => !el.closest('[aria-hidden="true"]')
      );

    const topSec = sec('top');
    const linksSec = sec('links');
    const toolsSec = sec('tools');
    const logoutSec = sec('logout');

    const inTop = topSec?.contains(active);
    const inLinks = linksSec?.contains(active);
    const inTools = toolsSec?.contains(active);
    const inLogout = logoutSec?.contains(active);

    if (inLinks) {
      const items = focusable(linksSec);
      const idx = items.indexOf(active);
      if (e.key === 'ArrowDown') { e.preventDefault(); if (idx < items.length - 1) items[idx + 1]?.focus(); else focusable(toolsSec)[0]?.focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (idx > 0) items[idx - 1]?.focus(); else { const t = focusable(topSec); t[t.length - 1]?.focus(); } }
      else if (e.key === 'Home') { e.preventDefault(); items[0]?.focus(); }
      else if (e.key === 'End') { e.preventDefault(); items[items.length - 1]?.focus(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); focusable(toolsSec)[0]?.focus(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); const t = focusable(topSec); t[t.length - 1]?.focus(); }
    } else if (inTools) {
      const items = focusable(toolsSec);
      const idx = items.indexOf(active);
      if (e.key === 'ArrowRight') { e.preventDefault(); items[(idx + 1) % items.length]?.focus(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); items[(idx - 1 + items.length) % items.length]?.focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); const l = focusable(linksSec); l[l.length - 1]?.focus(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); focusable(logoutSec)[0]?.focus(); }
    } else if (inTop) {
      const items = focusable(topSec);
      const idx = items.indexOf(active);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (idx < items.length - 1) items[idx + 1]?.focus();
        else focusable(linksSec)[0]?.focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (idx > 0) items[idx - 1]?.focus();
        else focusable(logoutSec)[0]?.focus();
      }
    } else if (inLogout) {
      if (e.key === 'ArrowUp') { e.preventDefault(); focusable(toolsSec)[0]?.focus(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); const t = focusable(toolsSec); t[t.length - 1]?.focus(); }
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); focusable(topSec)[0]?.focus(); }
    }
  };

  return { t, items, isActive, isDrawerMode, handleKeyDown };
}
