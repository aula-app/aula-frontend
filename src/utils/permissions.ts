import { RoleTypes } from '@/types/SettingsTypes';
import { parseJwt } from './jwt';
import { localStorageGet } from './localStorage';

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
    idea: { role: 40 },
    vote: { role: 40 },
    user: { role: 50 },
    group: { role: 40 },
    action: { role: 50 },
    system: { role: 50 },
    danger: { role: 50 },
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
    like: { role: USERS_ADMIN },
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
  const jwt = localStorageGet('token');
  const user = !!jwt ? parseJwt(jwt) : false;
  const location = window.location.pathname.split('/');
  const roomIndex = location.findIndex((l) => l.includes('room')) + 1;
  const room_id = roomIndex === 0 ? '' : location[roomIndex];

  if (!(action in permissions[model])) return false;
  if (!user) return false;

  if (!!room_id && user.user_level < 40) {
    let rooms = user.roles.filter((r) => r.room == room_id);

    if (rooms.length < 1) return false;

    const roleInRoom = rooms[0].role;
    let hasRolePermission = false;

    if (
      typeof permissions[model][action].role === 'number'
        ? roleInRoom >= permissions[model][action].role
        : permissions[model][action].role.includes(roleInRoom)
    ) {
      hasRolePermission = true;
    }

    if (permissions[model][action].self) {
      return hasRolePermission || user_id === user.user_hash;
    }

    return hasRolePermission;
  }

  if (typeof permissions[model][action].role === 'number') {
    return user.user_level >= permissions[model][action].role;
  } else {
    return permissions[model][action].role.includes(user.user_level);
  }
}
