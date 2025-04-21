export type ReportType = 'bugs' | 'reports' | undefined;

export interface DrawerSideBarProps {
  anchor: 'left' | 'right';
  open: boolean;
  variant: 'permanent' | 'persistent' | 'temporary';
  onClose: (event: React.MouseEvent<HTMLButtonElement> | {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
  id?: string;
  'aria-label'?: string;
}

export interface SideBarContentProps {
  isFixed?: boolean;
  onClose?: DrawerSideBarProps['onClose'];
}
