import { useIdpImportGate } from '@/hooks/useIdpImportGate';
import { clearAuth } from '@/services/auth';
import { useAppStore } from '@/store';
import { checkPermissions } from '@/utils';
import AboutView from '@/v2/views/private/About';
import Boxes from '@/v2/views/private/Boxes';
import Ideas from '@/v2/views/private/Ideas';
import NotFoundView from '@/v2/views/private/NotFound';
import RoomLayout from '@/v2/views/private/Room';
import IdeaView from '@/views/Idea';
import IdeasBoxView from '@/views/IdeasBox';
import UserMessagesView from '@/views/Messages';
import AnnouncementView from '@/views/Messages/Announcement';
import MessageView from '@/views/Messages/Message';
import ReportView from '@/views/Messages/Report';
import OfflineView from '@/views/OfflineView';
import PhasesView from '@/views/Phases';
import SchoolSetupView from '@/views/Public/SchoolSetupView';
import AnnouncementsView from '@/views/Settings/Announcements';
import BoxesView from '@/views/Settings/Boxes';
import BugsView from '@/views/Settings/Bugs';
import ConfigView from '@/views/Settings/Config';
import IdeasSettingsView from '@/views/Settings/Ideas';
import IdpSyncView from '@/views/Settings/IdpSync';
import MessagesView from '@/views/Settings/Messages';
import { UserProfileView } from '@/views/Settings/Profile';
import ReportsView from '@/views/Settings/Reports';
import RequestsView from '@/views/Settings/Requests';
import RoomsView from '@/views/Settings/Rooms';
import UsersView from '@/views/Settings/Users';
import UpdatesView from '@/views/Updates';
import WelcomeView from '@/views/Welcome';
import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import RestrictedRoutes from './RestrictedRoutes';

const PrivateRoutes = () => {
  const [, dispatch] = useAppStore();
  const location = useLocation();

  // Runs on every authenticated render, so it covers both the login hop
  // (OAuthLogin navigates straight here) and a reload mid-import. The hook
  // polls, so neither sticks on whatever getIdpImportStatus first returned.
  const { phase: importPhase, status: importStatus, dismiss: dismissImport } = useIdpImportGate();

  useEffect(() => {
    if (location.pathname.includes('password')) clearAuth(dispatch);
  }, [location.pathname, dispatch]);

  if (importPhase !== 'checking' && importPhase !== 'clear') {
    return <SchoolSetupView phase={importPhase} status={importStatus} onDismiss={dismissImport} />;
  }

  if (checkPermissions('system', 'hide')) return <RestrictedRoutes />;

  return (
    <Routes>
      <Route path="/" element={<WelcomeView />} />
      <Route path="oauth-login/*" element={<SsoCallbackLanded />} />
      <Route path="about" element={<AboutView />} />
      <Route path="announcements" element={<UserMessagesView />} />
      <Route path="announcements/:announcement_id" element={<AnnouncementView />} />
      <Route path="messages" element={<UserMessagesView />} />
      <Route path="messages/:message_id" element={<MessageView />} />
      <Route path="reports/:report_id" element={<ReportView />} />
      <Route path="bugs/:report_id" element={<ReportView />} />
      <Route path="requests/:report_id" element={<ReportView />} />
      <Route path="phase/:phase" element={<PhasesView />} />
      <Route path="room/:room_id/" element={<RoomLayout />}>
        <Route path="phase/0" element={<Ideas />} />
        <Route path="phase/:phase" element={<Boxes />} />
        <Route path="phase/:phase/idea/:idea_id" element={<IdeaView />} />
        <Route path="phase/:phase/idea-box/:box_id" element={<IdeasBoxView />} />
        <Route path="phase/:phase/idea-box/:box_id/idea/:idea_id" element={<IdeaView />} />
      </Route>
      <Route path="settings/profile" element={<UserProfileView />} />
      {checkPermissions('announcements', 'viewAll') && (
        <Route path="settings/announcements" element={<AnnouncementsView />} />
      )}
      {checkPermissions('boxes', 'viewAll') && <Route path="settings/boxes" element={<BoxesView />} />}
      {checkPermissions('configs', 'viewAll') && <Route path="settings/configuration" element={<ConfigView />} />}
      {checkPermissions('ideas', 'viewAll') && <Route path="settings/ideas" element={<IdeasSettingsView />} />}
      {checkPermissions('configs', 'viewAll') && <Route path="settings/idp-sync" element={<IdpSyncView />} />}
      {checkPermissions('messages', 'viewAll') && <Route path="settings/messages" element={<MessagesView />} />}
      {checkPermissions('reports', 'viewAll') && <Route path="settings/reports" element={<ReportsView />} />}
      {checkPermissions('reports', 'viewAll') && <Route path="settings/bugs" element={<BugsView />} />}
      {checkPermissions('requests', 'viewAll') && <Route path="settings/requests" element={<RequestsView />} />}
      {checkPermissions('rooms', 'viewAll') && <Route path="settings/rooms" element={<RoomsView />} />}
      {checkPermissions('users', 'viewAll') && <Route path="settings/users" element={<UsersView />} />}
      <Route path="updates" element={<UpdatesView />} />
      <Route path="offline" element={<OfflineView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

const SsoCallbackLanded = () => <Navigate to="/" replace />;

export default PrivateRoutes;
