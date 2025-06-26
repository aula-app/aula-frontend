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
  codeMirrorPlugin,
} from '@mdxeditor/editor';
import { keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import { FormControl, FormControlProps, FormHelperText, FormLabel as MuiFormLabel, Stack, styled } from '@mui/material';
import React, { useEffect, useRef, useCallback } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom keymap to completely disable Tab indentation
  const disableTabKeymap = Prec.highest(
    keymap.of([
      {
        key: 'Tab',
        preventDefault: true,
        stopPropagation: true,
        run: () => {
          // Do nothing - this completely blocks Tab from doing anything in the editor
          return true;
        },
      },
      {
        key: 'Shift-Tab',
        preventDefault: true,
        stopPropagation: true,
        run: () => {
          // Do nothing - this completely blocks Shift+Tab from doing anything in the editor
          return true;
        },
      },
    ])
  );

  // Handle Tab navigation at the DOM level as a fallback
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();

      const focusableElements = document.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), a[href]'
      );
      const focusableArray = Array.from(focusableElements) as HTMLElement[];
      const container = containerRef.current;

      if (container) {
        const currentIndex = focusableArray.findIndex((el) => container.contains(el));

        if (event.shiftKey) {
          // Shift+Tab: go to previous element
          if (currentIndex > 0) {
            let prevIndex = currentIndex - 1;
            while (prevIndex >= 0 && container.contains(focusableArray[prevIndex])) {
              prevIndex--;
            }
            if (prevIndex >= 0) {
              focusableArray[prevIndex].focus();
            }
          }
        } else {
          // Tab: go to next element
          if (currentIndex !== -1) {
            let nextIndex = currentIndex + 1;
            while (nextIndex < focusableArray.length && container.contains(focusableArray[nextIndex])) {
              nextIndex++;
            }
            if (nextIndex < focusableArray.length) {
              focusableArray[nextIndex].focus();
            }
          }
        }
      }
    }
  }, []);

  // Set up DOM event listener for Tab handling
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown, true);
      return () => {
        container.removeEventListener('keydown', handleKeyDown, true);
      };
    }
  }, [handleKeyDown]);

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
            <div ref={containerRef}>
              <Editor
                className={`md-editor ${!!fieldState.error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
                markdown={''}
                toMarkdownOptions={{}}
                sx={{ height: '100%' }}
                plugins={[
                  headingsPlugin(),
                  listsPlugin(),
                  codeMirrorPlugin({
                    codeBlockLanguages: {
                      js: 'JavaScript',
                      ts: 'TypeScript',
                      jsx: 'React JSX',
                      tsx: 'React TSX',
                    },
                    codeMirrorExtensions: [disableTabKeymap],
                  }),
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
            </div>
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
