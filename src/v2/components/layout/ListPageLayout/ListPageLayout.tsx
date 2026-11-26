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
  <div className="flex flex-col h-full">
    {header}
    {toolbar}
    {action}
    {children}
  </div>
);

export default ListPageLayout;
