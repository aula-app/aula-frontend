import { parseJwt } from './jwt';
import { localStorageGet } from './localStorage';

const permissions = {
  announcements: {
    create: { role: 40 },
    edit: { role: 40 },
    delete: { role: 40 },
    changeStatus: { role: 40 },
  },
  boxes: {
    addIdea: { role: 40 },
    create: { role: 40 },
    edit: { role: 30, self: true },
    delete: { role: 30, self: true },
    changeStatus: { role: 40 },
    changePhase: { role: 40, self: true },
    changePhaseDuration: { role: 40, self: true },
  },
  categories: {
    create: { role: 50 },
    edit: { role: 50 },
    delete: { role: 50 },
    changeStatus: { role: 40 },
  },
  comments: {
    create: { role: 20 },
    edit: { role: 30, self: true },
    delete: { role: 30 },
    changeStatus: { role: 40 },
  },
  groups: {
    addIdea: { role: 40 },
    create: { role: 50 },
    edit: { role: 50 },
    delete: { role: 50 },
    changeStatus: { role: 50 },
  },
  ideas: {
    addCategory: { role: 20 },
    create: { role: 20 },
    edit: { role: 30, self: true },
    delete: { role: 40 },
    like: { role: [20, 31, 41, 45] },
    vote: { role: [20, 31, 41, 45] },
    changeStatus: { role: 40 },
  },
  messages: {
    create: { role: 40 },
    edit: { role: 40 },
    delete: { role: 40 },
    changeStatus: { role: 40 },
  },
  rooms: {
    addBox: { role: 40 },
    create: { role: 50 },
    edit: { role: 50 },
    delete: { role: 50 },
    viewAll: { role: 40 },
    changeStatus: { role: 50 },
  },
  surveys: {
    create: { role: 30 },
  },
  system: {
    edit: { role: 50 },
    hide: { role: 60 },
  },
  users: {
    create: { role: 50 },
    edit: { role: 50 },
    delete: { role: 50 },
    changeStatus: { role: 50 },
  },
} as Record<string, Record<string, { role: number | number[]; self?: boolean }>>;

/**
 * Checks if the current user has sufficient permissions for a given role level
 */
const jwt = localStorageGet('token');
const user = !!jwt ? parseJwt(jwt) : false;

export function checkPermissions(path: keyof typeof permissions, [value]: string, user_id?: string): boolean {
  if (!(value in permissions[path])) return false;
  if (!user) return false;

  const isAllowed =
    typeof permissions[path][value].role === 'number'
      ? permissions[path][value].role <= user.user_level
      : permissions[path][value].role.includes(user.user_level);

  const isSelf = user_id ? user_id === user.user_id : false;

  return isAllowed && permissions[path][value].self ? isSelf : true;
}
