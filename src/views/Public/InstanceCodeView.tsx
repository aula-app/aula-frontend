import { useAppStore } from "@/store";
import { localStorageSet } from "@/utils";
import { Button, CircularProgress, Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { KeyboardEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface InstanceResponse {
  api: string;
}

/**
 * Choose your instance view
 */
const InstanceCodeView = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [code, setCode] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const saveCode = async () => {
    if (!code.trim()) {
      setError(t('generics.required'));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const request = await fetch(`${import.meta.env.VITE_APP_MULTI_AULA}/instance/${code}`);
      const response = await request.json() as InstanceResponse[];

      if (response.length > 0) {
        localStorageSet("code", code);
        localStorageSet("api_url", response[0].api);
        navigate("/");
      } else {
        setError(t('generics.wrong'));
        dispatch({ type: 'ADD_POPUP', message: { message: t('generics.wrong'), type: 'error' } });
      }
    } catch (err) {
      setError(t('generics.error'));
      dispatch({ type: 'ADD_POPUP', message: { message: t('generics.error'), type: 'error' } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: 400, margin: '0 auto', p: 2 }}>
      <TextField
        disabled={isLoading}
        id="instance-code"
        label={t('code')}
        variant="outlined"
        error={!!error}
        helperText={error || t('type_instance_code')}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter") saveCode();
        }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setCode(event.target.value);
          if (error) setError("");
        }}
      />
      <Button
        disabled={isLoading}
        variant="contained"
        onClick={saveCode}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        {t("confirm")}
      </Button>
    </Stack>
  );
};

export default InstanceCodeView;
