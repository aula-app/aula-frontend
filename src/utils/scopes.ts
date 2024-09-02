import { SettingNamesType } from '@/types/SettingsTypes';

interface scopeType {
  name: string;
  model: string;
  item: string;
  items: string;
  id: string;
  fetch: string;
  get: string;
  add: string;
  edit: string;
  delete: string;
  isChild?: SettingNamesType;
  move?: {
    model: string;
    add: string;
    remove: string;
    target: SettingNamesType;
    targetId: string;
    get: string;
  };
}

export const scopeDefinitions = {
  boxes: {
    name: 'boxes',
    model: 'Topic',
    item: 'Topic',
    items: 'Topics',
    id: 'topic_id',
    fetch: 'getTopics',
    get: 'getTopicBaseData',
    add: 'addTopic',
    edit: 'editTopic',
    delete: 'deleteTopic',
  },
  bug: {
    name: 'bug',
    model: 'Message',
    item: 'Message',
    items: 'Messages',
    id: 'message_id',
    fetch: 'getMessages',
    get: 'getMessageBaseData',
    add: 'addMessage',
    edit: 'editMessage',
    delete: 'deleteMessage',
  },
  categories: {
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
  },
  comments: {
    name: 'comments',
    model: 'Comment',
    item: 'Comment',
    items: 'Comments',
    id: 'comment_id',
    fetch: 'getComments',
    get: 'getCommentBaseData',
    add: 'addComment',
    edit: 'editComment',
    delete: 'deleteComment',
  },
  ideas: {
    name: 'ideas',
    model: 'Idea',
    item: 'Idea',
    items: 'Ideas',
    id: 'idea_id',
    fetch: 'getIdeas',
    get: 'getIdeaBaseData',
    add: 'addIdea',
    edit: 'editIdea',
    delete: 'deleteIdea',
  },
  messages: {
    name: 'messages',
    model: 'Text',
    item: 'Text',
    items: 'Texts',
    id: 'text_id',
    fetch: 'getTexts',
    get: 'getTextBaseData',
    add: 'addText',
    edit: 'editText',
    delete: 'deleteText',
  },
  report: {
    name: 'report',
    model: 'Message',
    item: 'Message',
    items: 'Messages',
    id: 'message_id',
    fetch: 'getMessages',
    get: 'getMessageBaseData',
    add: 'addMessage',
    edit: 'editMessage',
    delete: 'deleteMessage',
  },
  rooms: {
    name: 'rooms',
    model: 'Room',
    item: 'Room',
    items: 'Rooms',
    id: 'room_id',
    fetch: 'getRooms',
    get: 'getRoomBaseData',
    add: 'addRoom',
    edit: 'editRoom',
    delete: 'deleteRoom',
    move: {
      model: 'user',
      add: 'addUserToRoom',
      remove: 'removeUserFromRoom',
      get: 'getUsersByRoom',
      target: 'users',
      targetId: 'user_id',
    },
  },
  users: {
    name: 'users',
    model: 'User',
    item: 'User',
    items: 'Users',
    id: 'user_id',
    fetch: 'getUsers',
    get: 'getUserBaseData',
    add: 'addUser',
    edit: 'editUser',
    delete: 'deleteUser',
    move: {
      model: 'user',
      add: 'addUserToRoom',
      remove: 'removeUserFromRoom',
      get: 'getRoomsByUser',
      target: 'rooms',
      targetId: 'room_id',
    },
  },
} as Record<SettingNamesType, scopeType>;
