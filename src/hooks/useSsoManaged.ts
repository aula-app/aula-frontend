/**
 * Whether the current user is managed by an external identity provider (SSO).
 *
 * Dark launch: there is no backend flag yet, so this is inert (`false`) for
 * everyone. A QA/dev override lets us preview the managed UX before the flag
 * exists: `localStorage.setItem('sso_managed_override', 'true')`.
 *
 * When the backend flag ships, replace the body below with the real read
 * (JWT claim / user field / runtime config) and keep returning a boolean.
 * NOTE: the login/recovery call sites run pre-authentication, so if the
 * backend exposes a separate instance-level signal, wire that one in here for
 * those guards. The login flow is expected to change; do not pre-build for it.
 */
export function useSsoManaged(): boolean {
  if (typeof window !== 'undefined' && localStorage.getItem('sso_managed_override') === 'true') {
    return true;
  }
  return false;
}
