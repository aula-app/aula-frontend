import Icon, { ICON_TYPE } from '@/components/new/Icon/Icon';
import IconButton from '@/components/new/IconButton';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error' | 'neutral';

const SEVERITY_ICONS: Record<AlertSeverity, ICON_TYPE> = {
  info: 'about',
  success: 'check',
  warning: 'request',
  error: 'error',
  neutral: 'about',
};

// Each severity is a filled pair from the theme: the surface, and the
// foreground tuned to stay legible on it in both light and dark.
const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  info: 'bg-info text-info-fg',
  success: 'bg-success text-success-fg',
  warning: 'bg-warning text-warning-fg',
  error: 'bg-error text-error-fg',
  neutral: 'bg-surface text-muted',
};

interface Props {
  severity?: AlertSeverity;
  /** Small lead-in above the title, e.g. "Action needed:". */
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  /** Rendered below the body: the action this alert is asking for. */
  action?: ReactNode;
  /** Adds a dismiss control. Omit for a standing message that must not be cleared. */
  onDismiss?: () => void;
  className?: string;
  'data-testid'?: string;
}

/**
 * A standing status message with an optional call to action.
 *
 * Severity is never carried by colour alone: each level has its own icon, so
 * the distinction survives both themes and a reader who cannot see the tint.
 */
const Alert = ({
  severity = 'info',
  eyebrow,
  title,
  children,
  action,
  onDismiss,
  className = '',
  'data-testid': dataTestId,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div
      role={severity === 'error' || severity === 'warning' ? 'alert' : 'status'}
      data-testid={dataTestId}
      className={`flex flex-1 flex-col items-start gap-1 min-w-0 rounded-2xl p-4 ${SEVERITY_STYLES[severity]} ${className}`}
    >
      <p className="font-bold text-lg flex items-center gap-1">
        <Icon type={SEVERITY_ICONS[severity]} size="1.25em" className="shrink-0" />
        {!!eyebrow && <span>{eyebrow}</span>}
        {!!title && <span>{title}</span>}
      </p>
      <p className="text-sm">{children}</p>
      {!!action && <div className="mt-2">{action}</div>}
      {!!onDismiss && (
        <IconButton
          className="shrink-0 -mt-1 -mr-1"
          title={t('ui.common.dismiss')}
          aria-label={t('ui.common.dismiss')}
          onClick={onDismiss}
          testId="alert-dismiss"
        >
          <Icon type="close" size="1.25em" />
        </IconButton>
      )}
    </div>
  );
};

export default Alert;
