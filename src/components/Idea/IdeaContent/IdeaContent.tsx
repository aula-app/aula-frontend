import { IdeaType } from '@/types/Scopes';
import { CustomFieldsType } from '@/types/SettingsTypes';
import { databaseRequest } from '@/utils';
import { Stack, Typography } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';

interface Props {
  idea: IdeaType;
}

const IdeaContent = ({ idea }: Props) => {
  const [fields, setFields] = useState<CustomFieldsType>({
    custom_field1: null,
    custom_field2: null,
  });

  async function getFields() {
    await databaseRequest({
      model: 'Settings',
      method: 'getCustomfields',
      arguments: {},
    }).then((response) => {
      if (response.success)
        setFields({
          custom_field1: response.data.custom_field1_name,
          custom_field2: response.data.custom_field2_name,
        });
    });
  }

  useEffect(() => {
    getFields();
  }, []);

  return (
    <Stack gap={1}>
      <Typography variant="h6">{idea.title}</Typography>
      <Typography>{idea.content}</Typography>
      {(Object.keys(fields) as Array<keyof CustomFieldsType>).map((customField) => (
        <Fragment key={customField}>
          {fields[customField] && idea[customField] && (
            <Typography mt={2}>
              <b>{fields[customField]}:</b> {idea[customField]}
            </Typography>
          )}
        </Fragment>
      ))}
    </Stack>
  );
};

export default IdeaContent;
