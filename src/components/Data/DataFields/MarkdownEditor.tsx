import { FormControl, FormHelperText } from '@mui/material';
import { Placeholder } from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonStrikethrough,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditorProvider,
  RichTextField,
} from 'mui-tiptap';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  name: string;
  control: Control<any, any>;
  required?: boolean;
  disbled?: boolean;
}

const MarkdownEditor: React.FC<Props> = ({ name, control, required = false, disbled = false }) => {
  const { t } = useTranslation();

  return (
    <Controller
      // @ts-ignore
      name={name}
      control={control}
      // @ts-ignore
      render={({ field, fieldState }) => {
        const tipTapEditor = useEditor({
          extensions: [
            StarterKit,
            Placeholder.configure({
              placeholder: `${t(`settings.columns.${name}`)}${required ? '*' : ` ${t('forms.validation.optional').toLowerCase()}`}`,
              showOnlyWhenEditable: false,
            }),
          ],
          content: field.value,
          onUpdate({ editor }) {
            field.onChange(editor.getHTML());
          },
        });
        return (
          <FormControl fullWidth>
            <RichTextEditorProvider editor={tipTapEditor}>
              <RichTextField
                controls={
                  <MenuControlsContainer>
                    <MenuSelectHeading />
                    <MenuDivider />
                    <MenuButtonBold />
                    <MenuButtonItalic />
                    <MenuButtonStrikethrough />
                    <MenuDivider />
                    <MenuButtonBlockquote />
                    <MenuDivider />
                    <MenuButtonOrderedList />
                    <MenuButtonBulletedList />
                  </MenuControlsContainer>
                }
              />
            </RichTextEditorProvider>
            <FormHelperText error={!!fieldState.error}>{t(fieldState.error?.message || ' ')}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

export default MarkdownEditor;
