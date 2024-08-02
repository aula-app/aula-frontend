import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Restyled Link for navigation in the App, support internal links by "to" prop and external links by "href" prop
 * @component LocaleSwitch
 */
const LocaleSwitch = ({ ...restOfProps }) => {
  const { t, i18n } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    if (!Object.keys(i18n.services.resourceStore.data).includes(event.target.value)) return;
    localStorage.setItem('lang', event.target.value);
    i18n.changeLanguage(event.target.value);
  };

  return (
    <FormControl>
      <Select variant="standard" value={i18n.language} onChange={handleChange} {...restOfProps}>
        {i18n &&
          Object.keys(i18n.services.resourceStore.data).map((lng) => (
            <MenuItem value={lng} key={lng}>
              {lng}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default LocaleSwitch;
