import { SettingNamesType } from '@/types/SettingsTypes';
import { STATUS } from './Data/formDefaults';

// Sets instance status value and labels
export const InstanceStatusOptions = [
  { value: 0, label: 'status.inactive' },
  { value: 1, label: 'status.active' },
  { value: 2, label: 'status.weekend' },
  { value: 3, label: 'status.vacation' },
  { value: 4, label: 'status.holiday' },
];

// Sets scope (ideas, boxes, etc) status value and labels
export const ScopeStatusOptions = [
  { value: 0, label: 'status.inactive' },
  { value: 1, label: 'status.active' },
  { value: 2, label: 'status.suspended' },
  { value: 3, label: 'status.archived' },
];

// Sets variable commands for different scopes (instance, ideas, boxes, etc) status value and labels
export const Commands = [
  {
    label: 'system',
    actions: [
      { label: 'commands.status', value: 0, options: InstanceStatusOptions },
      { label: 'commands.delete', value: 5 },
    ],
  },
  {
    label: 'users',
    actions: [
      { label: 'commands.status', value: 0, options: ScopeStatusOptions },
      { label: 'commands.delete', value: 5 },
    ],
  },
  {
    label: 'groups',
    actions: [
      { label: 'commands.status', value: 0, options: ScopeStatusOptions },
      { label: 'commands.delete', value: 5 },
    ],
  },
] as Array<{
  label: SettingNamesType | 'system';
  actions: { label: string; value: number; options?: { value: number; label: string }[] }[];
}>;

export const statusOptions = [{ label: 'status.all', value: -1 }, ...STATUS];
