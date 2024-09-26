import { checkPermissions } from '@/utils';
import { NotFoundView } from '@/views';
import AboutView from '@/views/About';
import MessagesView from '@/views/Messages';
import AnnouncementView from '@/views/Messages/Announcement';
import MessageView from '@/views/Messages/Message';
import ReportView from '@/views/Messages/Report';
import RequestView from '@/views/Messages/Request';
import OfflineView from '@/views/OfflineView';
import PhasesView from '@/views/Phases';
import RoomView from '@/views/Room';
import IdeaView from '@/views/Room/Idea';
import IdeasBoxView from '@/views/Room/IdeasBox';
import RoomPhaseView from '@/views/Room/RoomPhaseView';
import SettingsView from '@/views/Settings';
import ConfigView from '@/views/Settings/Config';
import ReportsView from '@/views/Settings/Report';
import RequestsView from '@/views/Settings/Requests';
import UserView from '@/views/Settings/User';
import UpdatesView from '@/views/Updates';
import WelcomeView from '@/views/Welcome';
import { Navigate, Route, Routes } from 'react-router-dom';

/**
 * List of routes available only for authenticated users
 * Also renders the "Private Layout" composition
 */

const PrivateRoutes = () => (
  <Routes>
    <Route path="/" element={checkPermissions(60) ? <ConfigView /> : <WelcomeView />} />
    {!checkPermissions(60) && (
      <>
        <Route path="about" element={<AboutView />} />
        <Route path="phase/:phase" element={<PhasesView />} />
        <Route path="announcements" element={<MessagesView />} />
        <Route path="announcements/message/:message_id" element={<MessageView />} />
        <Route path="messages" element={<MessagesView />} />
        <Route path="messages/message/:message_id" element={<MessageView />} />
        <Route path="messages/report/:message_id" element={<ReportView />} />
        <Route path="messages/request/:message_id" element={<RequestView />} />
        <Route path="messages/announcement/:message_id" element={<AnnouncementView />} />
        <Route path="updates" element={<UpdatesView />} />
        <Route path="room/:room_id/phase/:phase" element={<RoomView />}>
          <Route path="" element={<RoomPhaseView />} />
          <Route path="idea/:idea_id" element={<IdeaView />} />
          <Route path="idea-box/:box_id" element={<IdeasBoxView />} />
          <Route path="idea-box/:box_id/idea/:idea_id" element={<IdeaView />} />
        </Route>
        <Route path="settings/profile" element={<UserView />} />
        <Route path="settings/reports" element={checkPermissions(50) ? <ReportsView /> : <Navigate to="/" />} />
        <Route path="settings/requests" element={checkPermissions(50) ? <RequestsView /> : <Navigate to="/" />} />
        <Route path="settings/configuration" element={checkPermissions(50) ? <ConfigView /> : <Navigate to="/" />} />
        <Route path="settings/:setting_name" element={<SettingsView />} />
        <Route path="settings/:setting_name/:setting_id" element={<SettingsView />} />
        <Route path="offline" element={<OfflineView />} />
      </>
    )}
    <Route path="*" element={<NotFoundView />} />
  </Routes>
);

export default PrivateRoutes;
