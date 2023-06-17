import { Route, Routes } from 'react-router-dom';
import { NotFoundView, UserView } from '../views';
import AboutView from '../views/About';
import { WelcomeView } from '../views/Welcome';
import { RoomsView } from '../views/Rooms';
import { IdeasView } from '../views/Ideas';
import { IdeaView } from '../views/Idea';
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
      <Route path="ideas" element={<IdeasView />} />,
      <Route path="users" element={<UsersView />} />,
      <Route path="idea/:ideaId" element={<IdeaView />} />,
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default PrivateRoutes;
