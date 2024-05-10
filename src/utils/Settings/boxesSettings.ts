import * as yup from 'yup';

export const boxesSettings = {
  requests: {
    model: 'Topic',
    id: 'topic_id',
    get: 'getTopicBaseData',
    add: 'addTopic',
    edit: 'editTopic',
    delete: 'deleteTopic',
    decrypt: ['name','description_internal','description_public'],
  },
  forms: [
    {
      name: 'name',
      label: 'Name',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: false,
      schema: yup.string().required(),
    },
    ,
    {
      name: 'description_public',
      label: 'Public Description',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: true,
      schema: yup.string().required(),
    },
    {
      name: 'description_internal',
      label: 'Internal Description',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: true,
      schema: yup.string(),
    },
    {
      name: 'room_id',
      label: 'Room ID',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: false,
      schema: yup.number().required(),
    },
  ]
}