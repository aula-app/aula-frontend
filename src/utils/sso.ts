import { UserType } from '@/types/Scopes';

/**
 * Whether a user's identity is owned by the school's identity provider (SSO).
 *
 * `idp_user_id` is stamped the moment the directory import creates the account;
 * `sso_sub` only appears once that person has actually signed in. Either one
 * means the account is provider-managed, so username/email/realname and the
 * password are all out of aula's hands.
 */
export const isSsoUser = (user?: Pick<UserType, 'idp_user_id' | 'sso_sub'> | null): boolean =>
  !!(user?.idp_user_id || user?.sso_sub);
