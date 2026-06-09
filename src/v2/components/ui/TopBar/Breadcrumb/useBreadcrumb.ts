import { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';
import { useAppStore } from '@/store/AppStore';
import { useTranslation } from 'react-i18next';

export type BreadcrumbNavItem = [string, string];

export const useBreadcrumb = () => {
  const { t } = useTranslation();
  const [appState] = useAppStore();
  const { breadcrumb } = appState;

  const isPhaseUrl = (url: string) => /\/phase\/\d+$/.test(url);
  const filteredBreadcrumbs = breadcrumb.filter((item, index) => index === 0 || !isPhaseUrl(item[1]));

  const getIconForBreadcrumb = (label: string, url: string): ICON_TYPE | null => {
    const lowerLabel = label.toLowerCase();

    if (lowerLabel === 'aula' || url === '/') return 'home';
    if (lowerLabel.includes('idea-box') || url.includes('/idea-box')) return 'box';
    if (lowerLabel.includes('idea') || url.includes('/idea')) return 'idea';
    if (lowerLabel.includes('announcement') || url.includes('/announcement')) return 'announcement';
    if (lowerLabel.includes('message') || url.includes('/message')) return 'message';
    if (lowerLabel.includes('report') || url.includes('/report')) return 'report';
    if (lowerLabel.includes('request') || url.includes('/request')) return 'request';
    if (lowerLabel.includes('room') || url.includes('/room')) return 'room';
    if (lowerLabel.includes('box') || url.includes('/box')) return 'box';

    return null;
  };

  const isEmpty = filteredBreadcrumbs.length === 0;
  const currentPage = isEmpty ? '' : filteredBreadcrumbs[filteredBreadcrumbs.length - 1][0];
  const navItems: BreadcrumbNavItem[] = [
    [t('ui.navigation.home'), '/'],
    ...filteredBreadcrumbs.slice(0, -1),
  ];

  return { isEmpty, currentPage, navItems, getIconForBreadcrumb };
};
