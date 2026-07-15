import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '../../button/IconButton';
import Icon from '../Icon';
import SearchBar from '../SearchBar';

type ScopeHeaderProps = {
  title: ReactNode;
  searchable?: boolean;
};

const ScopeHeader = ({ title, searchable = false }: ScopeHeaderProps) => {
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex flex-col p-2 pb-0 sm:p-4 sm:pb-0">
      <div className="flex justify-between items-center">
        {title}
        {searchable && (
          <IconButton
            aria-label={t(isSearchOpen ? 'v2.ui.actions.close' : 'v2.ui.actions.search')}
            hint={t(isSearchOpen ? 'v2.ui.actions.close' : 'v2.ui.actions.search')}
            aria-expanded={isSearchOpen}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Icon type={isSearchOpen ? 'close' : 'search'} size="1.5em" />
          </IconButton>
        )}
      </div>
      {searchable && <SearchBar open={isSearchOpen} />}
    </div>
  );
};

export default ScopeHeader;
