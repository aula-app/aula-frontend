import { alpha, IconButton, IconButtonProps, Tooltip, Typography } from '@mui/material';
import { ElementType, forwardRef, FunctionComponent, useMemo } from 'react';
import AppIcon from '../AppIcon';
import AppLink from '../AppLink';
import { AllIconsType } from '../AppIcon/AppIcon';

const MUI_ICON_BUTTON_COLORS = ['inherit', 'default', 'primary', 'secondary', 'success', 'error', 'info', 'warning'];

interface Props extends Omit<IconButtonProps, 'color'> {
  color?: string; // Not only 'inherit' | 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
  icon: AllIconsType;
  component?: ElementType; // Could be RouterLink, AppLink, <a>, etc.
  to?: string; // Link prop
  href?: string; // Link prop
  openInNewTab?: boolean; // Link prop
}

/**
 * Renders MUI IconButton with SVG image by given Icon name
 * @component AppIconButton
 */

const AppIconButton = ({
  color = 'default',
  component,
  children,
  disabled,
  icon,
  size,
  sx,
  title,
  ...restOfProps
}: Props) => {
  const componentToRender = !component && (restOfProps?.href || restOfProps?.to) ? AppLink : (component ?? IconButton);

  const isMuiColor = useMemo(() => MUI_ICON_BUTTON_COLORS.includes(color), [color]);

  const IconButtonToRender = useMemo(() => {
    const colorToRender = isMuiColor ? (color as IconButtonProps['color']) : 'default';
    const sxToRender = {
      ...sx,
      ...(isMuiColor
        ? {}
        : {
            color: color,
            ':hover': {
              backgroundColor: alpha(color, 0.04),
            },
          }),
    };
    return (
      <IconButton
        component={componentToRender}
        color={colorToRender}
        disabled={disabled}
        sx={sxToRender}
        {...restOfProps}
      >
        <AppIcon icon={icon} size={size} />
        <Typography pl={0.3}>{children}</Typography>
      </IconButton>
    );
  }, [color, componentToRender, children, disabled, icon, isMuiColor, sx, restOfProps]);

  // When title is set, wrap the IconButton with Tooltip.
  // Note: when IconButton is disabled the Tooltip is not working, so we don't need it
  return title && !disabled ? (
    <Tooltip title={title} arrow>
      {IconButtonToRender}
    </Tooltip>
  ) : (
    IconButtonToRender
  );
};

export default AppIconButton;
