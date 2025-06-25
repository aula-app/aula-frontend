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
import { FormControl, FormControlProps, FormHelperText, FormLabel as MuiFormLabel, Stack, styled } from '@mui/material';
import React, { useEffect } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props extends FormControlProps {
  name: string;
  control: Control<any, any>;
  required?: boolean;
  disabled?: boolean;
}

const StyledFormLabel = styled(MuiFormLabel)(({ theme }) => ({
  position: 'absolute',
  fontSize: '1rem',
  zIndex: 999,
  transform: 'translate(0, -.7rem) scale(0.75)',
  transformOrigin: 'top left',
  top: 0,
  left: 10,
  padding: theme.spacing(0, 1),
  backdropFilter: 'blur(100px)',
  transition: theme.transitions.create('color'),

  '.md-editor:focus-within + &': {
    color: theme.palette.primary.main,
  },
}));

const Editor = styled(MDXEditor)(({ theme }) => ({
  '&.md-editor': {
    position: 'relative',
    width: '100%',
    minWidth: '250px',
    outline: `1px solid ${theme.palette.input.border}`,
    borderRadius: theme.shape.borderRadius,
    fontFamily: theme.typography.fontFamily,
    fontSize: '1rem',
    lineHeight: 1.4375,

    '&:hover': {
      outlineColor: theme.palette.input.borderHover,
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

    svg: {
      color: theme.palette.text.primary,
    },

    // Textbox button styles
    '.mdxeditor-root-contenteditable *': {
      color: theme.palette.text.primary,
    },

    // Toolbar button styles
    '.mdxeditor-toolbar button': {
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(0.5),
      margin: theme.spacing(0.25),
      cursor: 'pointer',
      transition: theme.transitions.create(['background-color', 'color']),

      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },

      '&[data-active=true]': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.action.selected,
      },

      '&:disabled': {
        color: theme.palette.action.disabled,
        cursor: 'not-allowed',
      },
    },

    // Separator style
    '.separator': {
      width: '1px',
      margin: theme.spacing(0, 1),
      backgroundColor: theme.palette.input.border,
    },

    '&:hover .separator': {
      backgroundColor: theme.palette.input.borderHover,
    },

    '&:focus-within .separator': {
      backgroundColor: theme.palette.primary.main,
    },

    // Toolbar container
    '.editor-toolbar': {
      borderBottom: `1px solid ${theme.palette.input.border}`,
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
    },

    '&:hover .editor-toolbar': {
      borderBottomColor: theme.palette.input.borderHover,
    },

    '&:focus-within .editor-toolbar': {
      borderBottomColor: theme.palette.primary.main,
      borderBottomWidth: '2px',
    },
  },
}));

const MarkdownEditor: React.FC<Props> = ({ name, control, required = false, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
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
              aria-invalid={!!fieldState.error}
              aria-errormessage={fieldState.error ? `${name}-error-message` : undefined}
              aria-labelledby={`editor-${name}-label`}
            />
            <StyledFormLabel id={`editor-${name}-label`}>
              {t(`settings.columns.${name}`)}
              {required ? '*' : ''}
            </StyledFormLabel>
            {!!fieldState.error && (
              <FormHelperText id={`${name}-error-message`} error={!!fieldState.error}>
                {t(`${fieldState.error?.message || ''}`)}
              </FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
};

export default MarkdownEditor;
