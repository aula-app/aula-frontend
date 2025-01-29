import {
  BoldItalicUnderlineToggles,
  headingsPlugin,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  Separator,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor';
import { FormControl, FormHelperText, Stack, styled } from '@mui/material';
import React, { useEffect } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  name: string;
  control: Control<any, any>;
  required?: boolean;
  disabled?: boolean;
}

const Editor = styled(MDXEditor)(({ theme }) => ({
  '&.md-editor': {
    position: 'relative',
    width: '100%',
    minWidth: '250px',
    outline: `1px solid rgba(0, 0, 0, 0.23)`,
    borderRadius: theme.shape.borderRadius,
    fontFamily: theme.typography.fontFamily,
    fontSize: '1rem',
    lineHeight: 1.4375,
    backgroundColor: theme.palette.background.paper,

    '&:hover': {
      outlineColor: `rgb(0, 0, 0)`,
    },

    '&:focus-within': {
      outline: `2px solid ${theme.palette.primary.main}`,
      borderColor: 'transparent',
    },

    '&.error': {
      outlineColor: theme.palette.error.main,
    },

    '&.disabled': {
      backgroundColor: theme.palette.action.disabledBackground,
      borderColor: theme.palette.action.disabled,
      color: theme.palette.text.disabled,
    },
  },
}));

const MarkdownEditor: React.FC<Props> = ({ name, control, required = false, disabled = false }) => {
  const { t } = useTranslation();
  const mdxEditorRef = React.useRef<MDXEditorMethods>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        useEffect(() => {
          if (field.value) mdxEditorRef.current?.setMarkdown(field.value);
        }, [JSON.stringify(control._defaultValues)]);

        return (
          <FormControl fullWidth>
            <Editor
              className={`md-editor ${!!fieldState.error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
              markdown={''}
              toMarkdownOptions={{}}
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                toolbarPlugin({
                  toolbarContents: () => (
                    <Stack direction="row" justifyContent="space-between" width="100%">
                      <Stack direction="row">
                        <BoldItalicUnderlineToggles />
                        <Separator />
                        <ListsToggle />
                      </Stack>
                      <UndoRedo />
                    </Stack>
                  ),
                }),
              ]}
              {...field}
              ref={mdxEditorRef}
            />
            <FormHelperText error={!!fieldState.error}>{t(fieldState.error?.message || ' ')}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

export default MarkdownEditor;
