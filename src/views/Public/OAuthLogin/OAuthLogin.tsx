import { localStorageSet } from "@/utils";
import { useAppStore } from "@/store";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const OAuthLogin = () => {
  const params = useParams();
  const [, dispatch] = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    localStorageSet("token", params.jwt_token);
    console.log(params.jwt_token, params, "TOKEN");
    dispatch({ type: "LOG_IN" });
    navigate("/", { replace: true });
  }, []);

  return (<></>);

}

export default OAuthLogin;
