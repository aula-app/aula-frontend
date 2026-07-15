import { InputHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from '../../input/TextInput';
import Icon from '../Icon';

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const SearchBar = ({ label, ...props }: SearchBarProps) => {
  const { t } = useTranslation();
  return (
    <TextInput
      type="search"
      label={label ?? t('v2.ui.actions.search')}
      startAdornment={<Icon type="search" size="1.25em" />}
      {...props}
    />
  );
};

export default SearchBar;
