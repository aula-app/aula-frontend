import { SettingForm } from '@/types/scopes/SettingsTypes';
import * as yup from 'yup';

const forms = [
  {
    type: 'text',
    label: 'Description',
    column: 'description',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
] as SettingForm[]

export const RepportConfig = {
  forms: forms
}