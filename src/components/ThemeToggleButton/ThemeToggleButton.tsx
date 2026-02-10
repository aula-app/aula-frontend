import { useTranslation } from 'react-i18next';
import { useEventSwitchDarkMode } from '@/hooks';
import { useAppStore } from '@/store';
import IconButton from '@/components/new/IconButton';
import Icon from '@/components/new/Icon';

/**
 * Renders a theme toggle button (dark/light mode)
 * @component ThemeToggleButton
 */
const ThemeToggleButton = () => {
  const { t } = useTranslation();
  const [state] = useAppStore();
  const onSwitchDarkMode = useEventSwitchDarkMode();

  return (
    <IconButton
      onClick={onSwitchDarkMode}
      title={state.darkMode ? t('ui.lightMode') : t('ui.darkMode')}
      aria-label={state.darkMode ? t('ui.lightMode') : t('ui.darkMode')}
    >
      <Icon type={state.darkMode ? 'day' : 'night'} aria-hidden="true" size="1.5rem" />
    </IconButton>
  );
};

export default ThemeToggleButton;
