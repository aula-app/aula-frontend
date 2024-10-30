import ChangePassword from "@/components/ChangePassword";
import { useAppStore } from "@/store";
import { PassResponse } from "@/types/Generics";
import { localStorageGet } from "@/utils";
import { Alert, Collapse, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FormContainer } from "react-hook-form-mui";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

/**
 * Renders "Set Password" view for Login flow
 * url: /password/:key
 */

const SetPasswordView = () => {
  const { t } = useTranslation();
  const params = useParams();
  const api_url = localStorageGet("api_url");
  const jwt_token = localStorageGet("token");
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();
  const [isLoading, setLoading] = useState(false);
  const [isValid, setValid] = useState(true);

  const checkKey = async () => {
    try {
      setLoading(true)
      const request = await fetch(
          `${
            api_url
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
      setLoading(false)
      const response = await request.json();

      if (!response.success) setValid(false);
    } catch (e) {
      dispatch({ type: 'ADD_POPUP', message: {message: t('generics.wrong'), type: 'error'} });
    }
    return;
  };

  const setPass = async (password: string) => {
    try {
      setLoading(true)
      const request = await fetch(
          `${
            api_url
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

      const response = await request.json();
      setLoading(false)

      if (!response.success) dispatch({ type: 'ADD_POPUP', message: {message: t('generics.wrong'), type: 'error'} });
      else navigate("/");
    } catch (e) {
      dispatch({ type: 'ADD_POPUP', message: {message: t('generics.wrong'), type: 'error'} });
    }
    return;
  };

  const onSubmit = (formData: PassResponse) => {
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
        <Collapse in={!isValid} sx={{ mb: 2 }}>
          <Alert
            variant="outlined"
            severity="error"
            onClose={() => setValid(true)}
          >
            {t("login.codeError")}
          </Alert>
        </Collapse>
        <ChangePassword disabled={isLoading} onSubmit={onSubmit} hideOld />
      </Stack>
    </FormContainer>
  );
};

export default SetPasswordView;
