import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const AuthView = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) <Navigate to="/" />

  return (
    isAuthenticated && user && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.nickname}</p>
        <p>{user.email}</p>
      </div>
    )
  );
};

export default AuthView;