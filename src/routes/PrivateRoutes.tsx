import { clearAuth } from '@/services/auth';
import { useAppStore } from '@/store';
import { checkPermissions } from '@/utils';
import { NotFoundView } from '@/views';
import AboutView from '@/views/About';
import IdeaView from '@/views/Idea';
import IdeasBoxView from '@/views/IdeasBox';
import UserMessagesView from '@/views/Messages';
import AnnouncementView from '@/views/Messages/Announcement';
import MessageView from '@/views/Messages/Message';
import ReportView from '@/views/Messages/Report';
import OfflineView from '@/views/OfflineView';
import PhasesView from '@/views/Phases';
import RoomView from '@/views/Room';
import RoomPhaseView from '@/views/Room/RoomPhaseView';
import AnnouncementsView from '@/views/Settings/Announcements';
import BoxesView from '@/views/Settings/Boxes';
import BugsView from '@/views/Settings/Bugs';
import ConfigView from '@/views/Settings/Config';
import IdeasView from '@/views/Settings/Ideas';
import MessagesView from '@/views/Settings/Messages';
import { UserProfileView } from '@/views/Settings/Profile';
import ReportsView from '@/views/Settings/Reports';
import RequestsView from '@/views/Settings/Requests';
import RoomsView from '@/views/Settings/Rooms';
import UsersView from '@/views/Settings/Users';
import UpdatesView from '@/views/Updates';
import WelcomeView from '@/views/Welcome';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

/**
 * List of routes available only for authenticated users
 * Also renders the "Private Layout" composition
 */

const PrivateRoutes = () => {
  const [, dispatch] = useAppStore();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('password')) clearAuth(dispatch);
  }, [location.pathname, dispatch]);

  return checkPermissions('system', 'hide') ? (
    <Routes>
      <Route path="/" element={<ConfigView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/" element={<WelcomeView />} />
      <Route path="about" element={<AboutView />} />
      <Route path="announcements" element={<UserMessagesView />} />
      <Route path="announcements/:announcement_id" element={<AnnouncementView />} />
      <Route path="messages" element={<UserMessagesView />} />
      <Route path="messages/:message_id" element={<MessageView />} />
      <Route path="reports/:report_id" element={<ReportView />} />
      <Route path="bugs/:report_id" element={<ReportView />} />
      <Route path="requests/:report_id" element={<ReportView />} />
      <Route path="phase/:phase" element={<PhasesView />} />
      <Route path="room/:room_id/phase/:phase" element={<RoomView />}>
        <Route path="" element={<RoomPhaseView />} />
        <Route path="idea/:idea_id" element={<IdeaView />} />
        <Route path="idea-box/:box_id" element={<IdeasBoxView />} />
        <Route path="idea-box/:box_id/idea/:idea_id" element={<IdeaView />} />
      </Route>
      <Route path="settings/profile" element={<UserProfileView />} />
      {checkPermissions('announcements', 'viewAll') && (
        <Route path="settings/announcements" element={<AnnouncementsView />} />
      )}
      {checkPermissions('boxes', 'viewAll') && <Route path="settings/boxes" element={<BoxesView />} />}
      {checkPermissions('configs', 'viewAll') && <Route path="settings/configuration" element={<ConfigView />} />}
      {checkPermissions('ideas', 'viewAll') && <Route path="settings/ideas" element={<IdeasView />} />}
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

export default PrivateRoutes;
