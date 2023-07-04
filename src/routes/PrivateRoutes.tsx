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
import { MessagesView } from '../views/Messages';
import { AskConsentView } from '../views/AskConsent';
import { localStorageGet } from '../utils/localStorage';
import { useAppStore } from '../store';


/**
 * List of routes available only for authenticated users
 * Also renders the "Private Layout" composition
 */
const PrivateRoutes = () => {
  const [state, dispatch] = useAppStore();
  const hasConsent = state.hasConsent;
  return (
    <Routes>
      <Route path="/" element={(!hasConsent)?<AskConsentView/>:<WelcomeView />} />
      <Route path="welcome" element={(!hasConsent)?<AskConsentView/>:<WelcomeView />} />
      <Route path="user" element={(!hasConsent)?<AskConsentView/>:<UserView />} />
      <Route path="about" element={(!hasConsent)?<AskConsentView/>:<AboutView />} />,
      <Route path="rooms" element={(!hasConsent)?<AskConsentView/>:<RoomsView />} />,
      <Route path="room/:room_id" element={(!hasConsent)?<AskConsentView/>:<RoomView />} />,
      <Route path="groups" element={(!hasConsent)?<AskConsentView/>:<GroupsView />} />,
      <Route path="ideas" element={(!hasConsent)?<AskConsentView/>:<IdeasView />} />,
      <Route path="messages" element={(!hasConsent)?<AskConsentView/>:<MessagesView />} />,
      <Route path="users" element={(!hasConsent)?<AskConsentView/>:<UsersView />} />,
      <Route path="idea/:ideaId" element={(!hasConsent)?<AskConsentView/>:<IdeaView />} />,
      <Route path="*" element={(!hasConsent)?<AskConsentView/>:<NotFoundView />} />
    </Routes>
  );
};

export default PrivateRoutes;
