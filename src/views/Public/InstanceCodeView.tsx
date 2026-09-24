import { useAppStore } from '@/store';
import { Alert, Autocomplete, Button, CircularProgress, createFilterOptions, Stack, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { validateAndSaveInstanceCode } from '@/services/instance';
import { getSchoolInstancesRequest, SchoolItem, GetSchoolInstancesResponse } from '@/services/requests-v2';

interface SchoolItemOption extends SchoolItem {
  inputValue?: string;
}

const filter = createFilterOptions<SchoolItemOption>({
  ignoreAccents: true,
  ignoreCase: true
});

const InstanceCodeView = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [value, setValue] = useState<SchoolItemOption | null>(null);

  const [schools, setSchools] = useState<GetSchoolInstancesResponse>([]);
  const [isFetchingSchools, setIsFetchingSchools] = useState(false);
  const [fetchSchoolsError, setFetchSchoolsError] = useState('');

  const fetchSchools = useCallback(async () => {
    setIsFetchingSchools(true);
    return getSchoolInstancesRequest()
      .then((schools) => setSchools(schools))
      .catch((e) => {
        console.error(e);
        setFetchSchoolsError(t('instance.fetchSchoolsError'));
      })
      .finally(() => {
        setIsFetchingSchools(false);
      });
  }, [t]);

  useEffect(() => {
    // TODO fix/appease react linter
    fetchSchools();
  }, [fetchSchools])

  const handleSubmit = async () => {
    const code = value?.instance_code?.trim();

    if (!code) {
      setSubmitError(t('forms.validation.required'));
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const isValid = await validateAndSaveInstanceCode(code);
      if (isValid) {
        // Resume an IdP-initiated SSO hand-off (e.g. Eduplaces marketplace)
        // if the guard redirect carried `via=eduplaces` into the URL.
        if (searchParams.get('via') === 'eduplaces') {
          const resume = new URLSearchParams({ via: 'eduplaces' });
          const hint = searchParams.get('login_hint');
          if (hint) resume.set('login_hint', hint);
          navigate(`/login?${resume.toString()}`);
          return;
        }
        navigate('/');
      } else {
        setSubmitError(t('errors.default'));
        dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
      }
    } catch {
      setSubmitError(t('instance.error'));
      dispatch({ type: 'ADD_POPUP', message: { message: t('instance.error'), type: 'error' } });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: '100%', margin: '0 auto', p: 2 }}>
      <label htmlFor="instanceCode">
        {t('instance.headline1')}
        <Typography variant="body2" component="div">
          {t('instance.headlineSep')}
        </Typography>
        {t('instance.headline2')}
      </label>
      {/* following the MUI Autocomplete/FreeSolo/Creatable pattern:
          https://mui.com/material-ui/react-autocomplete/#creatable
          which presents a "virtual option" for free/unmatched, typed-in options.
          Other crucial features: autoHighlight+autoSelect make this
          virtual option first class (e.g. you can type-and-tab-on
          without clicking the virtual option) */}
      <Autocomplete
        sx={{ width: '20em', maxWidth: '100%' }}
        value={value}
        options={[
          ...schools.map((school) => school as SchoolItemOption)
        ]}
        id="instanceCode"
        freeSolo
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        autoHighlight
        autoSelect
        loading={isFetchingSchools}
        renderInput={(params) =>
          <TextField
            data-testid="input-instance-code"
            name="instance-code"
            error={!!submitError}
            helperText={submitError}
            placeholder={t('instance.placeholder')} {...params}
            onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') handleSubmit();
            }}
          />
        }
        onChange={(evt, newValue) => {
          setSubmitError('');
          if (typeof newValue === 'string') {
            // avoid "select by Enter => blur by Tab => free string reset"
            if (evt.type === 'blur') {
              return;
            }
            setValue({ name: newValue, instance_code: newValue });
          } else if (newValue && newValue.inputValue) {
            setValue({ name: newValue.inputValue, instance_code: newValue.inputValue });
          } else {
            setValue(newValue);
          }
        }}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        filterOptions={(options, params) => {
          const { inputValue } = params;
          // ensure that select drops down only when at least one character entered
          // has the side-effect to tame autoSelect+autoHighlight which would be over-eager otherwise
          const filtered = inputValue.length < 1
            ? []
            : filter(options, params);
          const isExisting = options.some((option) => inputValue === option.name);
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              inputValue,
              instance_code: inputValue,
              name: t('instance.autocompleteHint', { code: inputValue })
            });
          }
          return filtered;
        }}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              {option.name}
            </li>
          );
        }}
      />
      {fetchSchoolsError &&
        <Alert severity='warning'>{fetchSchoolsError}</Alert>
      }
      <Button
        sx={{ width: '100%' }}
        data-testid="submit-instance-code"
        name="submit-instance-code"
        disabled={isSubmitting}
        variant="contained"
        onClick={handleSubmit}
        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
      >
        {t('actions.confirm')}
      </Button>
    </Stack>
  );
};

export default InstanceCodeView;
