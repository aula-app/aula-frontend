import { Route, Routes } from 'react-router-dom';
import { NotFoundView } from '../views';
import AboutView from '../views/About';
import { WelcomeView } from '../views/Welcome';
import { RoomsView } from '../views/Rooms';
import { RoomView } from '../views/Room';
import { GroupsView } from '../views/Groups';
import { IdeasView } from '../views/Ideas';
import { IdeaView } from '../views/Idea';
import { UserView } from '../views/User';
import { UsersView } from '../views/Users';

/**
 * List of routes available only for authenticated users
 * Also renders the "Private Layout" composition
 */
const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomeView />} />
      <Route path="welcome" element={<WelcomeView />} />
      <Route path="user" element={<UserView />} />
      <Route path="about" element={<AboutView />} />,
      <Route path="rooms" element={<RoomsView />} />,
      <Route path="room/:room_id" element={<RoomView />} />,
      <Route path="groups" element={<GroupsView />} />,
      <Route path="ideas" element={<IdeasView />} />,
      <Route path="users" element={<UsersView />} />,
      <Route path="idea/:ideaId" element={<IdeaView />} />,
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default PrivateRoutes;
