import { Route, Routes } from 'react-router-dom';
import { NotFoundView } from '@/views';
import AboutView from '@/views/About';
import { SettingsView } from '@/views/Settings';
import { UserView } from '@/views/User';
import { WelcomeView } from '@/views/Welcome';
import { RoomView } from '@/views/Room';
import { IdeaView } from '@/views/Idea';
import { IdeasBoxView } from '@/views/IdeasBox';
import WildIdeas from '@/views/Room/WildIdeas';
import IdeasBoxes from '@/views/Room/IdeasBoxes';
/**
 * List of routes available only for authenticated users
 * Also renders the "Private Layout" composition
 */

const PrivateRoutes = () => (
  <Routes>
    <Route path="/" element={<WelcomeView />} />
    <Route path="welcome" element={<WelcomeView />} />
    <Route path="room/:room_id" element={<RoomView />}>
      <Route path="ideas" element={<WildIdeas />} />
      <Route path=":phase" element={<IdeasBoxes />} />
    </Route>,
    <Route path="room/:room_id/idea/:idea_id" element={<IdeaView />} />,
    <Route path="room/:room_id/idea-box/:box_id" element={<IdeasBoxView />} />,
    <Route path="room/:room_id/idea-box/:box_id/idea/:idea_id" element={<IdeaView />} />,
    <Route path="about" element={<AboutView />} />,
    <Route path="settings/profile" element={<UserView />} />
    <Route path="settings/:setting_name" element={<SettingsView />} />,
    <Route path="settings/:setting_name/:setting_id" element={<SettingsView />} />,
    <Route path="*" element={<NotFoundView />} />
  </Routes>
);

export default PrivateRoutes;
