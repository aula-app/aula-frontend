# V2 Login Form Validation — Design Spec

**Date:** 2026-05-12
**Scope:** First increment of the v2 `LoginView` migration — form validation only. API call, error handling, loading state, OAuth, and navigation are explicitly out of scope and will be added in subsequent increments.

---

## Context

The v2 `LoginView` (`src/v2/views/public/Login/LoginView.tsx`) is currently a static shell with unconnected `TextInput` and `Button` components. The original v1 `LoginView` (`src/views/Public/Login/LoginView.tsx`) is the reference implementation, combining form logic, API calls, error handling, and layout in a single component.

The v2 rewrite extracts behavior from the view using the hook pattern already established in the project. This spec covers increment 1: wiring up form validation.

---

## Architecture

### New file: `src/v2/views/public/Login/useLoginForm.ts`

A custom hook that owns all form-related concerns:

- **Validation schema** (yup): `username` required; `password` required, min 4, max 64 characters. Uses `t()` for error messages, matching v1 exactly.
- **`useForm`** wired to `yupResolver(schema)`.
- **Returns:** `{ register, handleSubmit, errors }` — nothing else at this stage. The submit handler passed to `handleSubmit` is a no-op placeholder for now.

This hook has no side effects, no API calls, and no navigation — purely form state and validation.

### Modified file: `src/v2/views/public/Login/LoginView.tsx`

- Calls `useLoginForm()` and destructures `{ register, handleSubmit, errors }`.
- Wraps the fieldset in `<form onSubmit={handleSubmit(onSubmit)} noValidate>`.
- Passes `{...register('username')}` and `error={errors.username?.message}` to the username `TextInput`.
- Passes `{...register('password')}` and `error={errors.password?.message}` to the password `TextInput`.
- `<Button type="submit">` — no `disabled` or loading state yet.

---

## Data Flow

```
LoginView
  └── useLoginForm()
        ├── yup schema
        ├── useForm + yupResolver
        └── returns { register, handleSubmit, errors }
            ↓
  <form onSubmit={handleSubmit(noop)}>
    <TextInput {...register('username')} error={errors.username?.message} />
    <TextInput {...register('password')} error={errors.password?.message} />
    <Button type="submit" />
```

---

## Out of Scope (future increments)

| Increment | What gets added |
|-----------|----------------|
| 2 | Submit handler + API call (`loginUser`) |
| 3 | Response handling (JWT, temp password, offline mode, user status errors) |
| 4 | Loading state (`isLoading`, button disabled) |
| 5 | Error alert UI |
| 6 | OAuth section |

---

## Constraints

- Use `react-hook-form` + `yup` + `@hookform/resolvers/yup` — already present in the project.
- Validation messages use `useTranslation` / `t()` with the same i18n keys as v1.
- `TextInput` already accepts `error?: string` and `ref` (via `forwardRef`) — no component changes needed.
