import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { NotFoundView } from '@/views';
import AboutView from '@/views/About';
import SettingsView from '@/views/Settings';
import UserView from '@/views/User';
import WelcomeView from '@/views/Welcome';
import RoomView from '@/views/Room';
import IdeaView from '@/views/Idea';
import IdeasBoxView from '@/views/IdeasBox';
import MessagesView from '@/views/Messages';
import MessageView from '@/views/Message';
/**
 * List of routes available only for authenticated users
 * Also renders the "Private Layout" composition
 */

function DefaultRoom() {
  // Get the userId param from the URL.
  let { room_id } = useParams();
  return (<Navigate to={`/room/${room_id}/ideas`} replace />)
}

const PrivateRoutes = () => (
  <Routes>
    <Route path="/" element={<WelcomeView />} />
    <Route path="about" element={<AboutView />} />,
    <Route path="messages" element={<MessagesView />} />
    <Route path="messages/message/:message_id" element={<MessageView />} />
    <Route path="settings/profile" element={<UserView />} />
    <Route path="settings/:setting_name" element={<SettingsView />} />,
    <Route path="settings/:setting_name/:setting_id" element={<SettingsView />} />,
    <Route path="room/:room_id" element={<DefaultRoom />} />,
    <Route path="room/:room_id/ideas" element={<RoomView />} />,
    <Route path="room/:room_id/boxes" element={<RoomView />} />,
    <Route path="room/:room_id/idea-box/:box_id" element={<IdeasBoxView />} />,
    <Route path="room/:room_id/idea-box/:box_id/idea/:idea_id" element={<IdeaView />} />,
    <Route path="room/:room_id/idea/:idea_id" element={<IdeaView />} />,
    <Route path="*" element={<NotFoundView />} />
  </Routes>
);

export default PrivateRoutes;
