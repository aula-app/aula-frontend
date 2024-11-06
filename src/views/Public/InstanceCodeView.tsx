import { useAppStore } from "@/store";
import { localStorageSet } from "@/utils";
import { Button, Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { KeyboardEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/**
 * Choose your instance view
 */
const InstanceCodeView = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [code, setCode] = useState("");
  const [isLoading, setLoading] = useState(false);
  let navigate = useNavigate();

  const saveCode = async () => {

    setLoading(true)

    const request =  await fetch(import.meta.env.VITE_APP_MULTI_AULA + "/instance/" + code)

    const response = await request.json();
    setLoading(false)

    if (response.length > 0) {
      localStorageSet("code", code);
      localStorageSet("api_url", response[0].api);
      navigate("/");
    } else {
      dispatch({ type: 'ADD_POPUP', message: {message: t('generics.wrong'), type: 'error'} });
    }
  };

  return (
    <Stack>
      <TextField
      disabled={isLoading}
        id="outlined-basic"
        label="code"
        variant="outlined"
        helperText="type instance code"
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter") saveCode();
        }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setCode(event.target.value);
        }}
      />
      <Button disabled={isLoading} variant="contained" onClick={saveCode}>
        {t("confirm")}
      </Button>
    </Stack>
  );
};

export default InstanceCodeView;
