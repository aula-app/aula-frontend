import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '../../button/IconButton';
import Icon from '../Icon';
import SearchBar from '../SearchBar';

type ScopeHeaderProps = {
  title: ReactNode;
  searchValue?: string;
  /** Enables the search UI. Called with the typed query, and with '' when the search is closed. */
  onSearchChange?: (value: string) => void;
};

const ScopeHeader = ({ title, searchValue, onSearchChange }: ScopeHeaderProps) => {
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleLabel = t(isSearchOpen ? 'v2.ui.actions.close' : 'v2.ui.actions.search');

  const toggleSearch = () => {
    if (isSearchOpen) onSearchChange?.('');
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <div className="flex flex-col p-2 pb-0 sm:p-4 sm:pb-0">
      <div className="flex justify-between items-center">
        {title}
        {onSearchChange && (
          <IconButton aria-label={toggleLabel} hint={toggleLabel} aria-expanded={isSearchOpen} onClick={toggleSearch}>
            <Icon type={isSearchOpen ? 'close' : 'search'} size="1.5em" />
          </IconButton>
        )}
      </div>
      {onSearchChange && (
        <SearchBar open={isSearchOpen} value={searchValue} onChange={(e) => onSearchChange(e.target.value)} />
      )}
    </div>
  );
};

export default ScopeHeader;
