import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { NotFoundView } from '@/views';
import AboutView from '@/views/About';
import { WelcomeView } from '@/views/Welcome';
import { RoomsSettingView } from '@/views/RoomSetting';
import { RoomView } from '@/views/Room';
import { GroupsView } from '@/views/Groups';
import { IdeaView } from '@/views/Idea';
import { IdeasView } from '@/views/Ideas';
import { IdeasBoxView } from '@/views/IdeasBox';
import { UserView } from '@/views/User';
import { UsersView } from '@/views/Users';
import { TextsView } from '@/views/Texts';

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
    <Route path="welcome" element={<WelcomeView />} />
    <Route path="user" element={<UserView />} />
    <Route path="about" element={<AboutView />} />,
    <Route path="rooms" element={<RoomsSettingView />} />,
    <Route path="room/:room_id" element={<DefaultRoom />} />,
    <Route path="room/:room_id/ideas" element={<RoomView />} />,
    <Route path="room/:room_id/boxes" element={<RoomView />} />,
    <Route path="room/:room_id/idea-box/:box_id" element={<IdeasBoxView />} />,
    <Route path="room/:room_id/idea-box/:box_id/idea/:idea_id" element={<IdeaView />} />,
    <Route path="groups" element={<GroupsView />} />,
    <Route path="ideas" element={<IdeasView />} />,
    <Route path="texts" element={<TextsView />} />,
    <Route path="users" element={<UsersView />} />,
    <Route path="room/:room_id/idea/:idea_id" element={<IdeaView />} />,
    <Route path="*" element={<NotFoundView />} />
  </Routes>
);

export default PrivateRoutes;
