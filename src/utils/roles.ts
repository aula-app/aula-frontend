import { RoleTypes } from '@/types/SettingsTypes';

/** User roles:
 * 10 => "guest",
 * 20 => "user",
 * 30 => "moderator",
 * 31 => "moderator_v",
 * 40 => "super_moderator",
 * 41 => "super_moderator_v",
 * 44 => "principal",
 * 45 => "principal_v",
 * 50 => "admin",
 * 60 => "tech_admin"
 */

export const roles = [10, 20, 30, 31, 40, 41, 44, 45, 50, 60] as Array<RoleTypes>;
