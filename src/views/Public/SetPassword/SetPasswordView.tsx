import ChangePassword from "@/components/ChangePassword";
import { useAppStore } from "@/store";
import { PassResponse } from "@/types/Generics";
import { localStorageGet } from "@/utils";
import { Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { FormContainer } from "react-hook-form-mui";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

/**
 * Renders "Recover Password" view for Login flow
 * url: /recovery/password
 */
const SetPasswordView = () => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const jwt_token = localStorageGet("token");
  const [, dispatch] = useAppStore();

  const checkKey = async () => {
    try {
      const response = await (
        await fetch(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/controllers/set_password.php?secret=${params.key}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt_token,
            },
            body: null,
          }
        )
      ).json();

      if (response && response.success) {
        console.log(response.data);
      } else {
        dispatch({ type: 'ADD_POPUP', message: {message: t('login.wrongKey'), type: 'error'} });
      }
    } catch (e) {
      console.log(e);
      dispatch({ type: 'ADD_POPUP', message: {message: t('generics.wrong'), type: 'error'} });
    }
    return;
  };

  const setPass = async (password: string) => {
    try {
      const response = await (
        await fetch(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/controllers/set_password.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt_token,
            },
            body: JSON.stringify({
              secret: params.key,
              password: password,
            }),
          }
        )
      ).json();

      if (response && response.success) {
        navigate("/");
      }
    } catch (e) {
      console.log(e);
      dispatch({ type: 'ADD_POPUP', message: {message: t('generics.wrong'), type: 'error'} });
    }
    return;
  };

  const onSubmit = (formData: PassResponse) => {
    //if (!isValid) return;
    setPass(formData.newPassword);
  };

  useEffect(() => {
    checkKey();
  }, []);

  return (
    <FormContainer>
      <Stack>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {t("login.setPass")}
        </Typography>
        <ChangePassword onSubmit={onSubmit} hideOld />
      </Stack>
    </FormContainer>
  );
};

export default SetPasswordView;
