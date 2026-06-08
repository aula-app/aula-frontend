# Instance Code Inline Form — Design Spec

**Date:** 2026-06-08  
**Status:** Approved

## Overview

Move the instance code form off its own `/code` route. Instead, embed it as a persistent field in the Login, SetPassword, and ResetPassword pages. When the code is already stored, the field shows in a disabled/read-only state with an Edit button. When not set, it is editable. On form submit, the code is validated and saved first; if that succeeds, the page's own submit logic runs.

## Architecture

### Components

**`InstanceCodeField`** (`src/v2/views/public/Code/InstanceCodeField.tsx`)  
A controlled input component. Receives `value`, `onChange`, `error`, `disabled`, `isEditing`, `onEditClick` as props. Renders:
- Disabled input + Edit button when `!isEditing && value`
- Enabled input when `isEditing || !value`

This component is purely presentational. No hooks or business logic inside.

### Hook

**`useInstanceCode`** (`src/v2/views/public/Code/useInstanceCode.ts`)  
Manages instance code state and validation. Returns:
- `instanceCode` — current value (from localStorage on init, or empty string)
- `setInstanceCode` — setter
- `isEditing` — whether the field is in edit mode
- `startEditing` — sets `isEditing = true`
- `isCodeReady` — `true` when code is already stored and not being edited
- `validateAndSave(code: string): Promise<boolean>` — calls `validateAndSaveInstanceCode`, updates local state on success

### Form submit integration

Each form's `onSubmit` receives the code state via `useInstanceCode`. Before running its own logic:
1. If `isCodeReady` → proceed directly
2. If not → call `validateAndSave(instanceCode)` → if fails, set error on code field and abort; if succeeds, proceed with form submit

The `InstanceCodeField` sits above the other form fields in each view.

### Files changed

| File | Change |
|------|--------|
| `src/v2/views/public/Code/InstanceCodeField.tsx` | New — presentational field component |
| `src/v2/views/public/Code/useInstanceCode.ts` | New — replaces `useCodeSubmit` |
| `src/v2/views/public/Code/InstanceCodeView.tsx` | Delete |
| `src/v2/views/public/Code/useCodeSubmit.ts` | Delete |
| `src/v2/views/public/Code/index.tsx` | Delete |
| `src/v2/views/public/Login/LoginView.tsx` | Add `InstanceCodeField` + code check in submit |
| `src/v2/views/public/SetPassword/SetPasswordView.tsx` | Add `InstanceCodeField` + code check in submit |
| `src/v2/views/public/ResetPassword/ResetPasswordView.tsx` | Add `InstanceCodeField` + code check in submit |
| `src/hooks/useInstanceGuard.ts` | Remove `/code` redirect; IS_MULTI branch becomes no-op |
| `src/routes/PublicRoutes.tsx` | Remove `/code` route and import |

## Behavior

- **Code set, not editing:** field is disabled, shows stored code, Edit button visible. Submit proceeds immediately to form logic.
- **Code not set:** field is enabled. Submit validates+saves code first. On failure: error on field, form does not submit. On success: field enters disabled state and form submit continues.
- **Edit button clicked:** field becomes enabled, previous value clears (user must re-enter). Submit will re-validate.
- **IS_MULTI = false:** `useInstanceCode` returns `isCodeReady = true` always (localStorage is set to `'SINGLE'` by `useInstanceGuard`). `InstanceCodeField` is not rendered.

## What is removed

- `/code` route entirely
- `useInstanceGuard` redirect logic (hook still runs but does nothing for IS_MULTI)
- `InstanceCodeView` standalone page
- `useCodeSubmit` hook
