import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const AuthView = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        // const response = await fetch('https://api.example.com/posts', {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        console.log(await token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAccessTokenSilently]);

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