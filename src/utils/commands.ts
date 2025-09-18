import { SettingNamesType } from '@/types/SettingsTypes';

// Sets instance status value and labels
export const InstanceStatusOptions = [
  { value: 0, label: 'status.inactive' },
  { value: 1, label: 'status.active' },
  { value: 2, label: 'status.weekend' },
  { value: 3, label: 'status.vacation' },
  { value: 4, label: 'status.holiday' },
];

export const STATUS = [
  { value: 0, label: 'status.inactive' },
  { value: 1, label: 'status.active' },
  { value: 2, label: 'status.suspended' },
  { value: 3, label: 'status.archived' },
];
export const statusOptions = [{ label: 'status.all', value: -1 }, ...STATUS];

// Sets variable commands for different scopes (instance, ideas, boxes, etc) status value and labels
export const Commands = [
  {
    label: 'system',
    actions: [
      { label: 'settings.columns.status', value: 0, options: InstanceStatusOptions },
      // { label: 'actions.delete', value: 5 },
    ],
  },
  // {
  //   label: 'users',
  //   actions: [
  //     { label: 'settings.columns.status', value: 0, options: STATUS },
  //     { label: 'actions.delete', value: 5 },
  //   ],
  // },
  // {
  //   label: 'groups',
  //   actions: [
  //     { label: 'settings.columns.status', value: 0, options: STATUS },
  //     { label: 'actions.delete', value: 5 },
  //   ],
  // },
] as Array<{
  label: SettingNamesType | 'system';
  actions: { label: string; value: number; options?: { value: number; label: string }[] }[];
}>;
