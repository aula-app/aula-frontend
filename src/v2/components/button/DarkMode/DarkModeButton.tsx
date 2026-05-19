import { useEventSwitchDarkMode } from '@/hooks';
import { useAppStore } from '@/store';
import IconButton from '@/v2/components/button/IconButton';
import Icon from '@/v2/components/ui/Icon';
import { useTranslation } from 'react-i18next';

const DarkModeButton = () => {
  const { t } = useTranslation();
  const [state] = useAppStore();
  const onSwitchDarkMode = useEventSwitchDarkMode();

  const label = t(`v2.ui.toggle`, {
    var: state.darkMode ? t('v2.ui.lightMode.label').toLowerCase() : t('v2.ui.darkMode.label').toLowerCase(),
  });

  return (
    <IconButton onClick={onSwitchDarkMode} aria-label={label} hint={label}>
      <Icon type={state.darkMode ? 'day' : 'night'} />
    </IconButton>
  );
};

export default DarkModeButton;
