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
import { FormControl, FormControlProps, FormHelperText, FormLabel, Stack, styled, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props extends FormControlProps {
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

const MarkdownEditor: React.FC<Props> = ({ name, control, required = false, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const mdxEditorRef = React.useRef<MDXEditorMethods>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        useEffect(() => {
          if (field.value) mdxEditorRef.current?.setMarkdown(field.value || control._defaultValues[name]);
        }, [control._defaultValues[name], field.value]);
        return (
          <FormControl fullWidth {...restOfProps}>
            <FormLabel
              sx={{
                position: 'absolute',
                fontSize: '1rem',
                zIndex: 999,
                transform: 'translate(0, -.7rem) scale(0.75)',
                transformOrigin: 'top left',
                color: 'rgba(0, 0, 0, 0.6)',
                top: 0,
                left: 10,
                backgroundColor: theme.palette.background.default,
                px: 1,
              }}
            >
              {t(`settings.columns.${name}`)}
              {required ? '*' : ''}
            </FormLabel>
            <Editor
              className={`md-editor ${!!fieldState.error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
              markdown={''}
              toMarkdownOptions={{}}
              sx={{ height: '100%' }}
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                toolbarPlugin({
                  toolbarClassName: 'editor-toolbar',
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
            {!!fieldState.error && (
              <FormHelperText error={!!fieldState.error}>{t(fieldState.error?.message || ' ')}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
};

export default MarkdownEditor;
