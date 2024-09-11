import { CategoryType } from '@/types/Scopes';
import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import { inputType } from '../formDefaults';

interface CategoryFields extends FieldType {
  name: keyof CategoryType;
}

interface CategoryColumns extends ColumnSettings {
  name: keyof CategoryType;
}

const columns = [
  { name: 'name', orderId: 5 },
  { name: 'created', orderId: 4 },
  { name: 'creator_id', orderId: 3 },
  { name: 'last_update', orderId: 0 },
] as Array<CategoryColumns>;

const fields = [
  {
    name: 'name',
    form: inputType.shortText,
    required: true,
    role: 20,
  },
  {
    name: 'description_internal',
    form: {
      type: 'icon',
      defaultValue: '',
    },
    required: false,
    role: 20,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
] as Array<CategoryFields>;

const requests = {
  name: 'categories',
  model: 'Idea',
  item: 'Category',
  items: 'Categories',
  id: 'category_id',
  fetch: 'getCategories',
  get: 'getCategoryBaseData',
  add: 'addCategory',
  edit: 'editCategory',
  delete: 'deleteCategory',
  move: {
    add: 'addIdeaToCategory',
    remove: 'removeIdeaFromCategory',
    target: 'ideas',
    targetId: 'idea_id',
  },
} as DataRequestsType;

export default { fields, columns, requests };
