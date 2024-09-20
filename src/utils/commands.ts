import { PossibleFields } from '@/types/Scopes';
import { InputType, STATUS } from './Data/formDefaults';
import { SettingNamesType } from '@/types/SettingsTypes';

export const InstanceStatusOptions = [
  { value: 0, label: 'status.inactive' },
  { value: 1, label: 'status.active' },
  { value: 2, label: 'status.weekend' },
  { value: 3, label: 'status.vacation' },
  { value: 4, label: 'status.holiday' },
];

export const ScopeStatusOptions = [
  { value: 0, label: 'status.inactive' },
  { value: 1, label: 'status.active' },
  { value: 2, label: 'status.suspended' },
  { value: 3, label: 'status.archived' },
];

export const Commands = [
  {
    label: 'system',
    actions: [{ label: 'commands.status', value: 0, options: InstanceStatusOptions }],
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

//   {
//     label: 'system',
//     options: [{ label: 'status', options: InstanceStatusOptions }],
//   },
//   {
//     label: 'users',
//     options: [
//       { label: 'user', options: 'users' },
//       { label: 'room', options: 'rooms' },
//     ],
//   },
//   {
//     label: 'groups',
//     options: [
//       { label: 'user', options: 'users' },
//       { label: 'room', options: 'rooms' },
//     ],
//   },
// ];

export const statusOptions = [{ label: 'status.all', value: -1 }, ...STATUS];
