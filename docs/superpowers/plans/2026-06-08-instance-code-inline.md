# Instance Code Inline Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the standalone `/code` route with an inline instance code field that lives at the top of the Login, SetPassword, and ResetPassword forms — disabled with an Edit button when already set, editable when not set, validated as part of the form submit.

**Architecture:** A `useInstanceCode` hook manages instance code state and provides a `validateCode()` function that each form calls before its own submit logic. A presentational `InstanceCodeField` component renders the field in disabled/editable states. The existing `useCodeSubmit` and `InstanceCodeView` are deleted; the `/code` route is removed.

**Tech Stack:** React 18, TypeScript, react-hook-form, yup, react-i18next, Tailwind CSS, `@/services/instance` (`validateAndSaveInstanceCode`), `@/utils` (`localStorageGet`), `@/config` (`getRuntimeConfig`)

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `src/v2/views/public/Code/useInstanceCode.ts` | Hook: state, validation, isEditing toggle |
| Create | `src/v2/views/public/Code/InstanceCodeField.tsx` | Presentational: disabled/editable input + Edit button |
| Modify | `src/locale/en.json` | Add `v2.ui.button.edit: "Edit"` |
| Modify | `src/locale/de.json` | Add `v2.ui.button.edit: "Bearbeiten"` |
| Modify | `src/v2/views/public/Login/LoginView.tsx` | Embed InstanceCodeField, wrap submit |
| Modify | `src/v2/views/public/SetPassword/SetPasswordView.tsx` | Embed InstanceCodeField, wrap submit |
| Modify | `src/v2/views/public/ResetPassword/ResetPasswordView.tsx` | Embed InstanceCodeField, wrap submit |
| Modify | `src/hooks/useInstanceGuard.ts` | Remove `/code` redirect |
| Modify | `src/routes/PublicRoutes.tsx` | Remove `/code` route and import |
| Delete | `src/v2/views/public/Code/InstanceCodeView.tsx` | No longer used |
| Delete | `src/v2/views/public/Code/useCodeSubmit.ts` | Replaced by useInstanceCode |
| Delete | `src/v2/views/public/Code/index.tsx` | No longer a routed entry point |

---

## Task 1: Add translation key

**Files:**
- Modify: `src/locale/en.json`
- Modify: `src/locale/de.json`

- [ ] **Step 1: Add `edit` key to `src/locale/en.json`**

Open `src/locale/en.json`. Find the `v2.ui.button` object (currently `cancel`, `clear`, `close`, `confirm`, `submit`) and add `edit`:

```json
"button": {
  "cancel": "Cancel",
  "clear": "Clear",
  "close": "Close",
  "confirm": "Confirm",
  "edit": "Edit",
  "submit": "Submit"
}
```

- [ ] **Step 2: Add `edit` key to `src/locale/de.json`**

Same location in `src/locale/de.json`:

```json
"button": {
  "cancel": "Abbrechen",
  "clear": "Löschen",
  "close": "Schließen",
  "confirm": "Bestätigen",
  "edit": "Bearbeiten",
  "submit": "Übermitteln"
}
```

- [ ] **Step 3: Type-check**

```bash
yarn check-type
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/locale/en.json src/locale/de.json
git commit -m "feat: add v2.ui.button.edit translation key"
```

---

## Task 2: Create `useInstanceCode` hook

**Files:**
- Create: `src/v2/views/public/Code/useInstanceCode.ts`

- [ ] **Step 1: Create the file**

Create `src/v2/views/public/Code/useInstanceCode.ts` with this content:

```typescript
import { validateAndSaveInstanceCode } from '@/services/instance';
import { getRuntimeConfig } from '@/config';
import { localStorageGet } from '@/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MIN_CODE_LENGTH = 3;
const MAX_CODE_LENGTH = 8;

export const useInstanceCode = () => {
  const { t } = useTranslation();
  const { IS_MULTI } = getRuntimeConfig();

  const stored = IS_MULTI ? (localStorageGet('code', false) as string | false) : 'SINGLE';
  const hasStored = typeof stored === 'string' && stored.length > 0;

  const [instanceCode, setInstanceCode] = useState(hasStored ? stored : '');
  const [isEditing, setIsEditing] = useState(!hasStored);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const startEditing = () => {
    setInstanceCode('');
    setIsEditing(true);
    setError(undefined);
  };

  /**
   * Call this at the top of any form's onSubmit before running its own logic.
   * Returns true if the code is ready (already stored or just validated+saved).
   * Returns false if validation failed — sets an error on the field.
   */
  const validateCode = async (): Promise<boolean> => {
    if (!IS_MULTI) return true;
    if (!isEditing) return true;

    const trimmed = instanceCode.trim();

    if (!trimmed) {
      setError(t('v2.form.validation.required'));
      return false;
    }
    if (trimmed.length < MIN_CODE_LENGTH) {
      setError(t('v2.form.validation.minLength', { var: MIN_CODE_LENGTH }));
      return false;
    }
    if (trimmed.length > MAX_CODE_LENGTH) {
      setError(t('v2.form.validation.maxLength', { var: MAX_CODE_LENGTH }));
      return false;
    }

    setIsLoading(true);
    try {
      const isValid = await validateAndSaveInstanceCode(trimmed);
      if (isValid) {
        setIsEditing(false);
        setError(undefined);
        return true;
      }
      setError(t('errors.default'));
      return false;
    } catch {
      setError(t('instance.error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    instanceCode,
    setInstanceCode,
    isEditing,
    startEditing,
    error,
    isLoading,
    validateCode,
    /** False when IS_MULTI=false — callers should not render InstanceCodeField */
    showField: IS_MULTI,
  };
};
```

- [ ] **Step 2: Type-check**

```bash
yarn check-type
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/v2/views/public/Code/useInstanceCode.ts
git commit -m "feat: add useInstanceCode hook"
```

---

## Task 3: Create `InstanceCodeField` component

**Files:**
- Create: `src/v2/views/public/Code/InstanceCodeField.tsx`

- [ ] **Step 1: Create the file**

Create `src/v2/views/public/Code/InstanceCodeField.tsx`:

```tsx
import Button from '@/v2/components/button/Button';
import TextInput from '@/v2/components/input/TextInput';
import { useTranslation } from 'react-i18next';

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isEditing: boolean;
  onEditClick: () => void;
  disabled?: boolean;
};

const InstanceCodeField = ({ value, onChange, error, isEditing, onEditClick, disabled }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <TextInput
          label={t('v2.form.code.label')}
          required
          autoCapitalize="none"
          error={error}
          helperText={isEditing ? t('v2.page.code.hint') : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing || disabled}
          data-testid="instance-code"
        />
      </div>
      {!isEditing && (
        <Button
          type="button"
          outlined
          color="secondary"
          onClick={onEditClick}
          disabled={disabled}
          data-testid="edit-instance-code"
        >
          {t('v2.ui.button.edit')}
        </Button>
      )}
    </div>
  );
};

export default InstanceCodeField;
```

- [ ] **Step 2: Type-check**

```bash
yarn check-type
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/v2/views/public/Code/InstanceCodeField.tsx
git commit -m "feat: add InstanceCodeField presentational component"
```

---

## Task 4: Integrate into `LoginView`

**Files:**
- Modify: `src/v2/views/public/Login/LoginView.tsx`

- [ ] **Step 1: Update `LoginView.tsx`**

Replace the entire file content with:

```tsx
import Button from '@/v2/components/button/Button';
import TextInput from '@/v2/components/input/TextInput';
import Link from '@/v2/components/navigation/Link';
import InstanceCodeField from '@/v2/views/public/Code/InstanceCodeField';
import { useInstanceCode } from '@/v2/views/public/Code/useInstanceCode';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useLoginSubmit } from './useLoginSubmit';

const MIN_PASSWORD_LENGTH = 4;
const MAX_PASSWORD_LENGTH = 64;

const LoginView: React.FC = () => {
  const { t } = useTranslation();
  const { onSubmit, isLoading } = useLoginSubmit();
  const { instanceCode, setInstanceCode, isEditing, startEditing, error: codeError, isLoading: codeLoading, validateCode, showField } = useInstanceCode();

  const schema = useMemo(
    () =>
      yup.object({
        username: yup.string().required(t('v2.form.validation.required')),
        password: yup
          .string()
          .required(t('v2.form.validation.required'))
          .min(MIN_PASSWORD_LENGTH, t('v2.form.validation.minLength', { var: MIN_PASSWORD_LENGTH }))
          .max(MAX_PASSWORD_LENGTH, t('v2.form.validation.maxLength', { var: MAX_PASSWORD_LENGTH })),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ username: string; password: string }>({
    resolver: yupResolver(schema),
  });

  const wrappedSubmit = async (data: { username: string; password: string }) => {
    const codeOk = await validateCode();
    if (!codeOk) return;
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(wrappedSubmit)} noValidate className="flex-1 flex flex-col gap-4">
      <h1>{t('v2.page.login.title', { var: 'Aula' })}</h1>

      <div className="rounded-box flex flex-col">
        {showField && (
          <InstanceCodeField
            value={instanceCode}
            onChange={setInstanceCode}
            error={codeError}
            isEditing={isEditing}
            onEditClick={startEditing}
            disabled={isLoading || codeLoading}
          />
        )}
        <TextInput
          label={t('v2.form.login.label')}
          required
          autoComplete="username"
          autoCapitalize="none"
          error={errors.username?.message}
          {...register('username')}
        />
        <TextInput
          label={t('v2.form.password.label')}
          type="password"
          required
          autoComplete="current-password"
          autoCapitalize="none"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" disabled={isLoading || codeLoading} data-testid="submit-login">
          {t('v2.page.login.button')}
        </Button>
        <Link to="/recovery" className="ml-auto px-2 text-sm text-text-secondary mt-4">
          {t('v2.page.recovery.link')}
        </Link>
      </div>
    </form>
  );
};

export default LoginView;
```

- [ ] **Step 2: Type-check**

```bash
yarn check-type
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/v2/views/public/Login/LoginView.tsx
git commit -m "feat: embed instance code field in LoginView"
```

---

## Task 5: Integrate into `SetPasswordView`

**Files:**
- Modify: `src/v2/views/public/SetPassword/SetPasswordView.tsx`

- [ ] **Step 1: Update `SetPasswordView.tsx`**

Replace the entire file content with:

```tsx
import Icon from '@/v2/components/ui/Icon';
import Button from '@/v2/components/button/Button';
import IconButton from '@/v2/components/button/IconButton';
import TextInput from '@/v2/components/input/TextInput';
import Link from '@/v2/components/navigation/Link';
import Hint from '@/v2/components/ui/Hint';
import InstanceCodeField from '@/v2/views/public/Code/InstanceCodeField';
import { useInstanceCode } from '@/v2/views/public/Code/useInstanceCode';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useSetPasswordSubmit, SetPasswordFormValues } from './useSetPasswordSubmit';

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 64;

const SetPasswordView = () => {
  const { t } = useTranslation();
  const { isValid, setValid, error, onSubmit } = useSetPasswordSubmit();
  const { instanceCode, setInstanceCode, isEditing, startEditing, error: codeError, isLoading: codeLoading, validateCode, showField } = useInstanceCode();

  const schema = useMemo(
    () =>
      yup.object({
        newPassword: yup
          .string()
          .required(t('v2.form.validation.required'))
          .min(MIN_PASSWORD_LENGTH, t('v2.form.validation.minLength', { var: MIN_PASSWORD_LENGTH }))
          .max(MAX_PASSWORD_LENGTH, t('v2.form.validation.maxLength', { var: MAX_PASSWORD_LENGTH })),
        confirmPassword: yup
          .string()
          .required(t('v2.form.validation.required'))
          .oneOf([yup.ref('newPassword')], t('v2.form.validation.passwordMatch')),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const wrappedSubmit = async (data: SetPasswordFormValues) => {
    const codeOk = await validateCode();
    if (!codeOk) return;
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(wrappedSubmit)} noValidate method="POST" className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl font-semibold">{t('v2.page.passwordSet.title')}</h2>

      {showField && (
        <InstanceCodeField
          value={instanceCode}
          onChange={setInstanceCode}
          error={codeError}
          isEditing={isEditing}
          onEditClick={startEditing}
          disabled={codeLoading}
        />
      )}

      {!isValid && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-error-text px-3 py-2 text-sm text-error-text"
        >
          <Hint content={t('v2.page.passwordSet.hint')} />
          <span className="flex-1">{t('v2.page.passwordSet.error')}</span>
          <IconButton
            aria-label={t('v2.ui.button.close')}
            hint={t('v2.ui.button.close')}
            onClick={() => setValid(true)}
            className="text-error-text"
            dense
          >
            <Icon type="close" />
          </IconButton>
        </div>
      )}

      <div className="flex flex-col">
        <TextInput
          type="password"
          label={t('v2.form.passwordNew.label')}
          required
          autoComplete="new-password"
          error={errors.newPassword?.message}
          helperText={
            <span className="flex gap-1">
              <Hint content={t('v2.form.passwordNew.hint')} />
              {t('v2.form.passwordNew.helper', { var: MIN_PASSWORD_LENGTH })}
            </span>
          }
          data-testid="newPassword-input"
          {...register('newPassword')}
        />

        <TextInput
          type="password"
          label={t('v2.form.passwordConfirm.label')}
          required
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" outlined onClick={() => reset()} color="secondary">
          {t('v2.ui.button.clear')}
        </Button>
        <Button type="submit" disabled={codeLoading} data-testid="submit-set-password">
          {t('v2.ui.button.confirm')}
        </Button>
      </div>
    </form>
  );
};

export default SetPasswordView;
```

- [ ] **Step 2: Type-check**

```bash
yarn check-type
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/v2/views/public/SetPassword/SetPasswordView.tsx
git commit -m "feat: embed instance code field in SetPasswordView"
```

---

## Task 6: Integrate into `ResetPasswordView`

**Files:**
- Modify: `src/v2/views/public/ResetPassword/ResetPasswordView.tsx`

- [ ] **Step 1: Update `ResetPasswordView.tsx`**

Replace the entire file content with:

```tsx
import Icon from '@/components/new/Icon/Icon';
import Button from '@/v2/components/button/Button';
import IconButton from '@/v2/components/button/IconButton/IconButton';
import TextInput from '@/v2/components/input/TextInput';
import Link from '@/v2/components/navigation/Link';
import Hint from '@/v2/components/ui/Hint';
import InstanceCodeField from '@/v2/views/public/Code/InstanceCodeField';
import { useInstanceCode } from '@/v2/views/public/Code/useInstanceCode';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useResetPasswordSubmit, ResetPasswordFormValues } from './useResetPasswordSubmit';

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 64;

const ResetPasswordView = () => {
  const { t } = useTranslation();
  const { onSubmit, error, setError } = useResetPasswordSubmit();
  const { instanceCode, setInstanceCode, isEditing, startEditing, error: codeError, isLoading: codeLoading, validateCode, showField } = useInstanceCode();

  const schema = useMemo(
    () =>
      yup.object({
        oldPassword: yup
          .string()
          .required(t('v2.form.validation.required'))
          .min(4, t('v2.form.validation.minLength', { var: 4 }))
          .max(MAX_PASSWORD_LENGTH, t('v2.form.validation.maxLength', { var: MAX_PASSWORD_LENGTH })),
        newPassword: yup
          .string()
          .required(t('v2.form.validation.required'))
          .min(MIN_PASSWORD_LENGTH, t('v2.form.validation.minLength', { var: MIN_PASSWORD_LENGTH }))
          .max(MAX_PASSWORD_LENGTH, t('v2.form.validation.maxLength', { var: MAX_PASSWORD_LENGTH })),
        confirmPassword: yup
          .string()
          .required(t('v2.form.validation.required'))
          .oneOf([yup.ref('newPassword')], t('v2.form.validation.passwordMatch')),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const wrappedSubmit = async (data: ResetPasswordFormValues) => {
    const codeOk = await validateCode();
    if (!codeOk) return;
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(wrappedSubmit)} noValidate method="POST" className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-semibold">{t('v2.page.passwordReset.title')}</h1>

      {showField && (
        <InstanceCodeField
          value={instanceCode}
          onChange={setInstanceCode}
          error={codeError}
          isEditing={isEditing}
          onEditClick={startEditing}
          disabled={codeLoading}
        />
      )}

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-error-text px-3 py-2 text-sm text-error-text"
        >
          <span className="flex-1">{error}</span>
          <IconButton onClick={() => setError('')} aria-label={t('v2.ui.button.close')} className="text-error-text">
            <Icon type="close" size="1.25em" />
          </IconButton>
        </div>
      )}

      <div className="flex flex-col">
        <TextInput
          type="password"
          label={t('v2.form.passwordTemporary.label')}
          required
          autoComplete="current-password"
          error={errors.oldPassword?.message}
          helperText={t('v2.form.passwordTemporary.helper')}
          data-testid="oldPassword-input"
          {...register('oldPassword')}
        />

        <TextInput
          type="password"
          label={t('auth.password.newPassword')}
          required
          autoComplete="new-password"
          error={errors.newPassword?.message}
          helperText={
            <span className="flex gap-1">
              <Hint content={t('v2.form.passwordNew.hint')} />
              {t('v2.form.passwordNew.helper', { var: MIN_PASSWORD_LENGTH })}
            </span>
          }
          data-testid="newPassword-input"
          {...register('newPassword')}
        />

        <TextInput
          type="password"
          label={t('auth.password.confirmPassword')}
          required
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          data-testid="confirmPassword-input"
          {...register('confirmPassword')}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" outlined onClick={() => reset()} color="secondary">
          {t('v2.ui.button.clear')}
        </Button>
        <Button type="submit" disabled={codeLoading} data-testid="submit-set-password">
          {t('v2.ui.button.confirm')}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordView;
```

- [ ] **Step 2: Type-check**

```bash
yarn check-type
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/v2/views/public/ResetPassword/ResetPasswordView.tsx
git commit -m "feat: embed instance code field in ResetPasswordView"
```

---

## Task 7: Remove `/code` route and clean up

**Files:**
- Modify: `src/hooks/useInstanceGuard.ts`
- Modify: `src/routes/PublicRoutes.tsx`
- Delete: `src/v2/views/public/Code/InstanceCodeView.tsx`
- Delete: `src/v2/views/public/Code/useCodeSubmit.ts`
- Delete: `src/v2/views/public/Code/index.tsx`

- [ ] **Step 1: Simplify `useInstanceGuard.ts`**

Replace the entire file with:

```typescript
import { useEffect } from 'react';
import { localStorageSet } from '@/utils';
import { getRuntimeConfig } from '@/config';

/**
 * For single-instance deployments, seeds localStorage with the default code/url so
 * the rest of the app can read them without special-casing IS_MULTI everywhere.
 */
export const useInstanceGuard = () => {
  useEffect(() => {
    const { IS_MULTI, CENTRAL_API_URL } = getRuntimeConfig();
    if (!IS_MULTI) {
      localStorageSet('code', 'SINGLE');
      localStorageSet('api_url', CENTRAL_API_URL);
    }
  }, []);
};
```

- [ ] **Step 2: Remove `/code` route from `PublicRoutes.tsx`**

Replace the entire file with:

```tsx
import { useInstanceGuard } from '@/hooks/useInstanceGuard';
import AboutView from '@/v2/views/public/About';
import Login from '@/v2/views/public/Login';
import NotFound from '@/v2/views/public/NotFound';
import OfflineView from '@/v2/views/public/Offline';
import Recovery from '@/v2/views/public/Recovery/RecoveryView';
import ResetPasswordView from '@/v2/views/public/ResetPassword';
import SetPasswordView from '@/v2/views/public/SetPassword';
import { OAuthLogin } from '@/views/Public';

import { Route, Routes } from 'react-router-dom';

/**
 * List of routes available only for anonymous users
 */
const PublicRoutes = () => {
  useInstanceGuard();

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/about" element={<AboutView />} />
      <Route path="login/*" element={<Login />} />
      <Route path="offline" element={<OfflineView />} />
      <Route path="oauth-login/:jwt_token" element={<OAuthLogin />} />
      <Route path="password/" element={<ResetPasswordView />} />
      <Route path="password/:key" element={<SetPasswordView />} />
      <Route path="recovery/*" element={<Recovery />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
```

- [ ] **Step 3: Delete old Code files**

```bash
rm src/v2/views/public/Code/InstanceCodeView.tsx
rm src/v2/views/public/Code/useCodeSubmit.ts
rm src/v2/views/public/Code/index.tsx
```

- [ ] **Step 4: Type-check**

```bash
yarn check-type
```

Expected: no errors. If any remaining file imports from `@/v2/views/public/Code` (the old `index.tsx`), update those imports to use the new paths.

- [ ] **Step 5: Build check**

```bash
yarn build
```

Expected: successful build with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useInstanceGuard.ts src/routes/PublicRoutes.tsx
git add -u src/v2/views/public/Code/
git commit -m "feat: remove /code route, instance code is now inline on public forms"
```
