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
  const [code, setCode] = useState("");
  let navigate = useNavigate();

  const saveCode = async () => {
    let api_url = await (
      await fetch(import.meta.env.VITE_APP_MULTI_AULA + "/instance/" + code)
    ).json();
    // TODO: Show message that the code was not found
    if (api_url.length > 0) {
      localStorageSet("code", code);
      localStorageSet("api_url", api_url[0].api);
      navigate("/");
    }
  };

  return (
    <Stack>
      <TextField
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
      <Button variant="contained" onClick={saveCode}>
        {t("confirm")}
      </Button>
    </Stack>
  );
};

export default InstanceCodeView;
