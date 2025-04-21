import { alpha, IconButton, IconButtonProps, Tooltip, Typography } from '@mui/material';
import { ElementType, useMemo } from 'react';
import AppIcon from '../AppIcon';
import { AllIconsType } from '../AppIcon/AppIcon';
import AppLink from '../AppLink';

const MUI_ICON_BUTTON_COLORS = ['inherit', 'default', 'primary', 'secondary', 'success', 'error', 'info', 'warning'];

interface Props extends Omit<IconButtonProps, 'size' | 'color'> {
  color?: string; // Not only 'inherit' | 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
  icon: AllIconsType;
  component?: ElementType; // Could be RouterLink, AppLink, <a>, etc.
  to?: string; // Link prop
  href?: string; // Link prop
  openInNewTab?: boolean; // Link prop
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'xxl'; // Icon's name alternate prop
  /**
   * Accessibility label for the button
   * Important for screen readers when there's only an icon
   */
  'aria-label'?: string;
  /**
   * Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed
   */
  'aria-expanded'?: boolean;
  /**
   * Identifies the element (or elements) whose contents or presence are controlled by this button
   */
  'aria-controls'?: string;
  /**
   * Indicates the current "pressed" state of toggle buttons
   */
  'aria-pressed'?: boolean;
}

/**
 * Renders MUI IconButton with SVG image by given Icon name
 * @component AppIconButton
 */

const AppIconButton: React.FC<Props> = ({
  color = 'default',
  component,
  children,
  disabled,
  icon,
  size,
  sx,
  title,
  ...restOfProps
}) => {
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
    
    // If there's no aria-label but there's a title, use the title as the aria-label
    const ariaProps = {
      'aria-label': restOfProps['aria-label'] || title,
      'aria-expanded': restOfProps['aria-expanded'],
      'aria-controls': restOfProps['aria-controls'],
      'aria-pressed': restOfProps['aria-pressed'],
    };
    
    return (
      <IconButton
        component={componentToRender}
        color={colorToRender}
        disabled={disabled}
        sx={sxToRender}
        {...restOfProps}
        {...ariaProps}
      >
        {/* If the icon is meaningful, it should be associated with the button's accessible name */}
        <AppIcon icon={icon} size={size} aria-hidden="true" />
        {children && <Typography pl={0.3}>{children}</Typography>}
      </IconButton>
    );
  }, [color, componentToRender, children, disabled, icon, isMuiColor, sx, title, restOfProps]);

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
