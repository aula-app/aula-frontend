import Button, { ButtonProps } from '@mui/material/Button';
import { ElementType, FunctionComponent, ReactNode, useMemo } from 'react';
import AppIcon from '../AppIcon';
import AppLink from '../AppLink';
import { APP_BUTTON_VARIANT } from '../config';
import { AllIconsType } from '../AppIcon/AppIcon';

const MUI_BUTTON_COLORS = ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'];

interface AppButtonProps extends Omit<ButtonProps, 'color' | 'endIcon' | 'startIcon'> {
  color?: string; // Not only 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
  endIcon?: AllIconsType;
  label?: string; // Alternate to .text
  text?: string; // Alternate to .label
  startIcon?: AllIconsType;
  // Missing props
  component?: ElementType; // Could be RouterLink, AppLink, <a>, etc.
  to?: string; // Link prop
  href?: string; // Link prop
  openInNewTab?: boolean; // Link prop
  underline?: 'none' | 'hover' | 'always'; // Link prop
}

const DEFAULT_SX_VALUES = {
  margin: 1, // By default the AppButton has theme.spacing(1) margin on all sides
};

/**
 * Application styled Material UI Button with Box around to specify margins using props
 * @component AppButton

 */
const AppButton = ({
  children,
  color: propColor = 'inherit',
  component: propComponent,
  endIcon,
  label,
  startIcon,
  sx: propSx,
  text,
  underline = 'none',
  variant = APP_BUTTON_VARIANT,
  ...restOfProps
}: AppButtonProps) => {
  const iconStart: ReactNode = useMemo(() => (!startIcon ? undefined : <AppIcon icon={startIcon} />), [startIcon]);

  const iconEnd: ReactNode = useMemo(() => (!endIcon ? undefined : <AppIcon icon={endIcon} />), [endIcon]);

  const isMuiColor = useMemo(() => MUI_BUTTON_COLORS.includes(propColor), [propColor]);

  const componentToRender =
    !propComponent && (restOfProps?.href || restOfProps?.to) ? AppLink : (propComponent ?? Button);

  const colorToRender = isMuiColor ? (propColor as ButtonProps['color']) : 'inherit';
  const sxToRender = {
    ...DEFAULT_SX_VALUES,
    ...propSx,
    ...(isMuiColor ? {} : { color: propColor }),
  };

  return (
    <Button
      component={componentToRender}
      color={colorToRender}
      endIcon={iconEnd}
      startIcon={iconStart}
      sx={sxToRender}
      variant={variant}
      {...{ ...restOfProps, underline }}
    >
      {children || label || text}
    </Button>
  );
};

export default AppButton;
