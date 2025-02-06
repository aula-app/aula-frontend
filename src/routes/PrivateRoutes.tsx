import { clearAuth } from '@/services/auth';
import { useAppStore } from '@/store';
import { checkPermissions } from '@/utils';
import { NotFoundView } from '@/views';
import AboutView from '@/views/About';
import IdeaView from '@/views/Idea';
import IdeasBoxView from '@/views/IdeasBox';
import MessagesView from '@/views/Messages';
import AnnouncementView from '@/views/Messages/Announcement';
import MessageView from '@/views/Messages/Message';
import ReportView from '@/views/Messages/Report';
import OfflineView from '@/views/OfflineView';
import PhasesView from '@/views/Phases';
import RoomView from '@/views/Room';
import RoomPhaseView from '@/views/Room/RoomPhaseView';
import AnnouncementsView from '@/views/Settings/Announcements';
import BoxesView from '@/views/Settings/Boxes';
import ConfigView from '@/views/Settings/Config';
import IdeasView from '@/views/Settings/Ideas';
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

  return checkPermissions(60) ? (
    <Routes>
      <Route path="/" element={<ConfigView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/" element={<WelcomeView />} />
      <Route path="about" element={<AboutView />} />
      <Route path="announcements" element={<MessagesView />} />
      <Route path="announcements/:announcement_id" element={<AnnouncementView />} />
      <Route path="messages" element={<MessagesView />} />
      <Route path="messages/:message_id" element={<MessageView />} />
      <Route path="reports" element={<MessagesView />} />
      <Route path="reports/:report_id" element={<ReportView />} />
      <Route path="requests" element={<MessagesView />} />
      <Route path="requests/:report_id" element={<ReportView />} />
      <Route path="phase/:phase" element={<PhasesView />} />
      <Route path="room/:room_id/phase/:phase" element={<RoomView />}>
        <Route path="" element={<RoomPhaseView />} />
        <Route path="idea/:idea_id" element={<IdeaView />} />
        <Route path="idea-box/:box_id" element={<IdeasBoxView />} />
        <Route path="idea-box/:box_id/idea/:idea_id" element={<IdeaView />} />
      </Route>
      <Route path="settings/announcements" element={<AnnouncementsView />} />
      <Route path="settings/boxes" element={<BoxesView />} />
      <Route path="settings/configuration" element={<ConfigView />} />
      <Route path="settings/ideas" element={<IdeasView />} />
      <Route path="settings/profile" element={<UserProfileView />} />
      <Route path="settings/reports" element={<ReportsView />} />
      <Route path="settings/requests" element={<RequestsView />} />
      <Route path="settings/rooms" element={<RoomsView />} />
      <Route path="settings/users" element={<UsersView />} />
      <Route path="updates" element={<UpdatesView />} />
      <Route path="offline" element={<OfflineView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default PrivateRoutes;
