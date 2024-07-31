import { NotFoundView } from '@/views';
import AboutView from '@/views/About';
import AskConsentView from '@/views/AskConsent';
import MessagesView from '@/views/Messages';
import MessageView from '@/views/Messages/Message';
import ReportView from '@/views/Messages/Report';
import RoomView from '@/views/Room';
import IdeaView from '@/views/Room/Idea';
import IdeasBoxView from '@/views/Room/IdeasBox';
import RoomPhaseView from '@/views/Room/RoomPhaseView';
import SettingsView from '@/views/Settings';
import ConfigView from '@/views/Settings/Config';
import ReportsView from '@/views/Settings/Report';
import UserView from '@/views/Settings/User';
import UpdatesView from '@/views/Updates';
import WelcomeView from '@/views/Welcome';
import { Route, Routes } from 'react-router-dom';
/**
 * List of routes available only for authenticated users
 * Also renders the "Private Layout" composition
 */

const PrivateRoutes = () => (
  <Routes>
    <Route path="/" element={<AskConsentView />} />
    <Route path="about" element={<AboutView />} />
    <Route path="welcome" element={<WelcomeView />} />
    <Route path="messages" element={<MessagesView />} />
    <Route path="messages/message/:message_id" element={<MessageView />} />
    <Route path="messages/report/:message_id" element={<ReportView />} />
    <Route path="updates" element={<UpdatesView />} />
    <Route path="room/:room_id/phase/:phase" element={<RoomView />}>
      <Route path="" element={<RoomPhaseView />} />
      <Route path="idea/:idea_id" element={<IdeaView />} />
      <Route path="idea-box/:box_id" element={<IdeasBoxView />} />
      <Route path="idea-box/:box_id/idea/:idea_id" element={<IdeaView />} />
    </Route>
    <Route path="settings/profile" element={<UserView />} />
    <Route path="settings/reports" element={<ReportsView />} />
    <Route path="settings/config" element={<ConfigView />} />
    <Route path="settings/:setting_name" element={<SettingsView />} />
    <Route path="settings/:setting_name/:setting_id" element={<SettingsView />} />
    <Route path="*" element={<NotFoundView />} />
  </Routes>
);

export default PrivateRoutes;
