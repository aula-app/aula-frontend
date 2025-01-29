import {
  BoldItalicUnderlineToggles,
  headingsPlugin,
  MDXEditor,
  MDXEditorMethods,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor';
import { FormControl, FormHelperText, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  name: string;
  control: Control<any, any>;
  required?: boolean;
  disabled?: boolean;
}

const MarkdownEditor: React.FC<Props> = ({ name, control, required = false, disabled = false }) => {
  const { t } = useTranslation();
  const mdxEditorRef = React.useRef<MDXEditorMethods>(null);

  return (
    <Controller
      // @ts-ignore
      name={name}
      control={control}
      // @ts-ignore
      render={({ field, fieldState }) => {
        useEffect(() => {
          if (field.value) mdxEditorRef.current?.setMarkdown(field.value);
        }, [JSON.stringify(control._defaultValues)]);
        return (
          <FormControl fullWidth>
            <MDXEditor
              markdown={''}
              plugins={[
                headingsPlugin(),
                toolbarPlugin({
                  toolbarClassName: 'my-classname',
                  toolbarContents: () => (
                    <Stack direction="row" justifyContent="space-between" width="100%">
                      <Stack direction="row">
                        <BoldItalicUnderlineToggles />
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
