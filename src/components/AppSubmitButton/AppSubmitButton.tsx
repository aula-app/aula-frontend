import Button, { ButtonProps } from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

interface Props extends ButtonProps {
  disabled?: boolean;
  label?: string;
}

/**
 * Application styled Material UI Button with Box around to specify margins using props
 * @component AppSubmitButton
 */
const AppSubmitButton = ({ disabled = false, label, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  return (
    <Button type="submit" color="primary" variant="contained" disabled={disabled} {...restOfProps}>
      {disabled ? t('generics.loading') : label || t('generics.confirm')}
    </Button>
  );
};

export default AppSubmitButton;
