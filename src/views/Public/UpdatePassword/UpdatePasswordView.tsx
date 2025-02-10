import ChangePassword from "@/components/ChangePassword";
import {
  Stack
} from "@mui/material";
import { useLocation } from "react-router-dom";

const UpdatePasswordView = () => {
  const location = useLocation();
  const JWT = location.state.tmp_jwt
  return (
    <Stack justifyContent="center">
        <ChangePassword tmp_token={JWT} />
    </Stack>
  );
};

export default UpdatePasswordView;