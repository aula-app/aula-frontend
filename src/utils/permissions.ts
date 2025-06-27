import { RoleTypes } from '@/types/SettingsTypes';
import { parseJwt } from './jwt';
import { localStorageGet } from './localStorage';

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

const USER_ROLES = [20, 30, 31, 40, 41, 44, 45];
const VOTING_ROLES = [20, 31, 41, 45];
const ADMIN = [50];
const USERS_ADMIN = USER_ROLES.concat(ADMIN);

const permissions = {
  announcements: {
    create: { role: 50 },
    edit: { role: 50 },
    delete: { role: 50 },
    viewAll: { role: ADMIN },
    status: { role: 50 },
  },
  boxes: {
    addIdea: { role: 30 },
    create: { role: 30 },
    edit: { role: 30 },
    delete: { role: 30 },
    status: { role: 30 },
    viewAll: { role: 40 },
    changePhase: { role: 30 },
    changePhaseDuration: { role: 30 },
  },
  categories: {
    create: { role: 50 },
    edit: { role: 50 },
    delete: { role: 50 },
    status: { role: 40 },
  },
  comments: {
    create: { role: USER_ROLES },
    edit: { role: 30, self: true },
    delete: { role: 30, self: true },
    status: { role: 40 },
  },
  configs: {
    action: { role: 50 },
    danger: { role: 50 },
    group: { role: 40 },
    idea: { role: 40 },
    system: { role: 50 },
    user: { role: 50 },
    viewAll: { role: 40 },
    vote: { role: 40 },
  },
  groups: {
    addIdea: { role: 40 },
    create: { role: 50 },
    edit: { role: 50 },
    delete: { role: 50 },
    status: { role: 50 },
  },
  ideas: {
    addCategory: { role: 20 },
    create: { role: USERS_ADMIN },
    edit: { role: 30, self: true },
    delete: { role: 30, self: true },
    like: { role: VOTING_ROLES, self: false },
    vote: { role: VOTING_ROLES },
    approve: { role: 44 },
    setWinner: { role: 30 },
    viewAll: { role: 40 },
    status: { role: 40 },
  },
  messages: {
    viewAll: { role: 40 },
    delete: { role: 50 },
    status: { role: 50 },
  },
  reports: {
    viewAll: { role: [40, 41, 44, 45, 50] },
    status: { role: 50 },
  },
  requests: {
    viewAll: { role: ADMIN },
    status: { role: 50 },
  },
  rooms: {
    addUser: { role: 50 },
    addBox: { role: 40 },
    create: { role: 50 },
    edit: { role: 40 },
    delete: { role: 50 },
    viewAll: { role: 40 },
    status: { role: 50 },
  },
  surveys: {
    create: { role: 30 },
  },
  system: {
    profile: { role: 20 },
    access: { role: 50 },
    edit: { role: 40 },
    hide: { role: 60 },
  },
  users: {
    addRole: { role: 50 },
    createAdmin: { role: ADMIN },
    create: { role: 50 },
    edit: { role: 50 },
    delete: { role: 50 },
    viewAll: { role: ADMIN },
    status: { role: 50 },
  },
} as Record<string, Record<string, { role: RoleTypes | RoleTypes[]; self?: boolean }>>;

/**
 * Checks if the current user has sufficient permissions for a given role level
 */
export function checkPermissions(model: keyof typeof permissions, action: string, user_id?: string): boolean {
  try {
    // Check user permissions
    const jwt = localStorageGet('token');
    if (!jwt) return false;

    const user = parseJwt(jwt);
    if (!user || !('user_level' in user)) return false;

    // Check if the model and action exist in permissions
    if (!(action in permissions[model])) return false;

    // Get room ID
    const location = window.location.pathname;
    const roomMatch = location.match(/\/room\/([^\/]+)/);
    const room_id = roomMatch ? roomMatch[1] : '';

    const permissionRule = permissions[model][action];
    const permissionRole = permissionRule.role;

    // Helper function to check self permissions
    const checkSelfPermission = (hasRolePermission: boolean): boolean => {
      if (permissionRule.self === undefined) {
        return hasRolePermission;
      }

      const isOwner = user_id === user.user_hash;

      if (permissionRule.self === true) {
        // User must be the owner OR have role permission
        return isOwner || hasRolePermission;
      } else {
        // User must NOT be the owner AND have role permission
        return !isOwner && hasRolePermission;
      }
    };

    // Room-based permissions for users below super_moderator level
    if (!!room_id && user.user_level < 40) {
      const rooms = user.roles.filter((r) => r.room == room_id);
      if (rooms.length < 1) return false;

      const roleInRoom = rooms[0].role;
      const hasRolePermission =
        typeof permissionRole === 'number' ? roleInRoom >= permissionRole : permissionRole.includes(roleInRoom);

      return checkSelfPermission(hasRolePermission);
    }

    // Global permissions
    const hasGlobalRolePermission =
      typeof permissionRole === 'number' ? user.user_level >= permissionRole : permissionRole.includes(user.user_level);

    return checkSelfPermission(hasGlobalRolePermission);
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
}
