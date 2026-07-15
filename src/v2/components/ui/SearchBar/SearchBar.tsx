import { InputHTMLAttributes, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from '../../input/TextInput';
import Collapse from '../Collapse';

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Whether the search field is expanded. Focuses the input when opened. */
  open: boolean;
  label?: string;
}

const SearchBar = ({ open, label, ...props }: SearchBarProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <Collapse open={open} innerClass="px-1 pt-2">
      <TextInput ref={inputRef} type="search" label={label ?? t('v2.ui.actions.search')} {...props} />
    </Collapse>
  );
};

export default SearchBar;
