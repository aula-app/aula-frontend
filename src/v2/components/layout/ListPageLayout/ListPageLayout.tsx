import React, { ReactNode } from 'react';

type ListPageLayoutProps = {
  header: ReactNode;
  /** Slot for filtering controls such as a search and sort bar. */
  toolbar?: ReactNode;
  /** Floating action, e.g. a Fab to create a new item. */
  action?: ReactNode;
  children: ReactNode;
};

const ListPageLayout = ({ header, toolbar, action, children }: ListPageLayoutProps) => (
  <div className="flex flex-1 flex-col h-full min-h-0 min-w-0">
    {header}
    {toolbar}
    {action}
    {children}
  </div>
);

export default ListPageLayout;
