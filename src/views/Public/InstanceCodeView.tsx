import { AppLink } from "@/components";
import { localStorageSet } from '@/utils';
import { useTranslation } from "react-i18next";
import TextField from '@mui/material/TextField';
import React from "react";
import { useNavigate } from 'react-router-dom';

/**
 * Choose your instance view
 */
const InstanceCodeView = () => {
  const { t } = useTranslation();
  const [code, setCode] = React.useState('');
  let navigate = useNavigate();

  const saveCode = async function (evt:React.KeyboardEvent<HTMLInputElement>) {
    if (evt.key === 'Enter') {
        let api_url = await (await fetch(import.meta.env.VITE_APP_MULTI_AULA + '/' + code)).json();
        localStorageSet("code", code);
        localStorageSet("api_url", api_url.api);
        navigate('/');
    }
  }

  return(
  <div>
        <TextField 
          id="outlined-basic"
          label="code"
          variant="outlined"
          helperText="type instance code"
          onKeyDown={saveCode}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCode(event.target.value);
          }}
          />
  </div>
)}

export default InstanceCodeView;
