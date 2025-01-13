import { Dispatch, MouseEvent, SetStateAction } from 'react';

export type ReportType = 'bug' | 'report' | undefined;

export interface BaseSideBarProps {
  setReport: Dispatch<SetStateAction<ReportType>>;
}

export interface DrawerSideBarProps extends BaseSideBarProps {
  anchor: 'left' | 'right';
  open: boolean;
  variant: 'permanent' | 'persistent' | 'temporary';
  onClose: (event: React.MouseEvent<HTMLButtonElement> | {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
}

export interface SideBarContentProps extends BaseSideBarProps {
  isFixed?: boolean;
  onClose?: DrawerSideBarProps['onClose'];
}
