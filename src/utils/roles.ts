import { RoleTypes } from '@/types/SettingsTypes';

/*
User roles:
10 - Guest – Read only
20 - Student - Can comment and interact
30 - Moderator - Can moderate within it´s own rooms
40 - Super Moderator - Can moderate any school's rooms
50 - School Admin - Has access to admin settings
60 - Tech Admin - Does not interact, only has access to a technical settings menu
*/

export const roles = [10, 20, 30, 40, 50, 60] as Array<RoleTypes>;
