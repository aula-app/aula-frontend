/**
 * Renders "Settings" component
 */

import { SIDEBAR_ITEMS } from '@/layout/config';
import { checkPermissions } from '@/utils';
import { Navigate, useParams } from 'react-router-dom';
import SettingsView from './SettingsView';

const Settings = () => {
  const { setting_name } = useParams();
  if (SIDEBAR_ITEMS.filter((page) => page.title === setting_name && checkPermissions(page.role)).length > 0)
    return <SettingsView />;

  return <Navigate to={'/'} />;
};

export default Settings;
