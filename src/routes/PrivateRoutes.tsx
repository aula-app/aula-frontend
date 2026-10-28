import { useIdpImportGate } from '@/hooks/useIdpImportGate';
import { clearAuth } from '@/services/auth';
import { useAppStore } from '@/store';
import { checkPermissions } from '@/utils';
import AboutView from '@/v2/views/private/About';
import Boxes from '@/v2/views/private/Boxes';
import Ideas from '@/v2/views/private/Ideas';
import NotFoundView from '@/v2/views/private/NotFound';
import RoomLayout from '@/v2/views/private/Room';
import Messages from '@/v2/views/private/Messages';
import AnnouncementView from '@/views/Messages/Announcement';
import OfflineView from '@/views/OfflineView';
import SchoolSetupView from '@/views/Public/SchoolSetupView';
import AnnouncementsView from '@/views/Settings/Announcements';
import BoxesView from '@/views/Settings/Boxes';
import ConfigView from '@/views/Settings/Config';
import IdeasSettingsView from '@/views/Settings/Ideas';
import IdpSyncView from '@/views/Settings/IdpSync';
import MessagesView from '@/views/Settings/Messages';
import { UserProfileView } from '@/views/Settings/Profile';
import RoomsView from '@/views/Settings/Rooms';
import UsersView from '@/views/Settings/Users';
import Updates from '@/v2/views/private/Updates';
import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import RestrictedRoutes from './RestrictedRoutes';
import Box from '@/v2/views/private/Box';
import Idea from '@/v2/views/private/Idea';
import Home from '@/v2/views/private/Home';
import Phase from '@/v2/views/private/Phase';

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
      <Route path="/" element={<Home />} />
      <Route path="oauth-login/*" element={<SsoCallbackLanded />} />
      <Route path="about" element={<AboutView />} />
      <Route path="announcements" element={<Messages />} />
      <Route path="announcements/:announcement_id" element={<AnnouncementView />} />
      <Route path="messages/:message_id?" element={<Messages />} />
      <Route path="reports/:message_id" element={<MessageRedirect />} />
      <Route path="bugs/:message_id" element={<MessageRedirect />} />
      <Route path="requests/:message_id" element={<MessageRedirect />} />
      <Route path="phase/:phase" element={<Phase />} />
      <Route path="room/:room_id/" element={<RoomLayout />}>
        <Route path="phase/0" element={<Ideas />} />
        <Route path="phase/:phase" element={<Boxes />} />
      </Route>
      <Route path="room/:room_id/phase/:phase/idea/:idea_id" element={<Idea />} />
      <Route path="room/:room_id/phase/:phase/idea-box/:box_id" element={<Box />} />
      <Route path="room/:room_id/phase/:phase/idea-box/:box_id/idea/:idea_id" element={<Idea />} />
      <Route path="settings/profile" element={<UserProfileView />} />
      {checkPermissions('announcements', 'viewAll') && (
        <Route path="settings/announcements" element={<AnnouncementsView />} />
      )}
      {checkPermissions('boxes', 'viewAll') && <Route path="settings/boxes" element={<BoxesView />} />}
      {checkPermissions('configs', 'viewAll') && <Route path="settings/configuration" element={<ConfigView />} />}
      {checkPermissions('ideas', 'viewAll') && <Route path="settings/ideas" element={<IdeasSettingsView />} />}
      {checkPermissions('configs', 'viewAll') && <Route path="settings/idp-sync" element={<IdpSyncView />} />}
      {checkPermissions('messages', 'viewAll') && <Route path="settings/messages" element={<MessagesView />} />}
      {checkPermissions('rooms', 'viewAll') && <Route path="settings/rooms" element={<RoomsView />} />}
      {checkPermissions('users', 'viewAll') && <Route path="settings/users" element={<UsersView />} />}
      <Route path="updates" element={<Updates />} />
      <Route path="offline" element={<OfflineView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

const SsoCallbackLanded = () => <Navigate to="/" replace />;

const MessageRedirect = () => <Navigate to={`/messages/${useParams().message_id}`} replace />;

export default PrivateRoutes;
