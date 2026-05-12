import Button from '@/v2/components/button/Button';
import TextInput from '@/v2/components/input/TextInput';
import Link from '@/v2/components/navigation/Link';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LoginView: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col justify-center gap-4">
      <h1>{t('auth.messages.welcome')}</h1>
      <fieldset className="rounded-box flex flex-col gap-3">
        <TextInput label={t('auth.login.label')} required />

        <TextInput label={t('auth.password.label')} type="password" required />

        <Button>{t('auth.login.button')}</Button>
        <Link to="/v2" className="ml-auto px-2 text-sm text-text-secondary">
          {t('auth.forgotPassword.link')}
        </Link>
      </fieldset>
    </div>
  );
};

export default LoginView;
