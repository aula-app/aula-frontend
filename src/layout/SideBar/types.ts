export type ReportType = 'bugs' | 'reports' | undefined;

export interface DrawerSideBarProps {
  anchor: 'left' | 'right';
  open: boolean;
  variant: 'permanent' | 'persistent' | 'temporary';
  onClose: (event: React.MouseEvent<HTMLButtonElement> | {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
}

export interface SideBarContentProps {
  isFixed?: boolean;
  onClose?: DrawerSideBarProps['onClose'];
}
