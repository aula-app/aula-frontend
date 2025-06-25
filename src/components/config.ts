/**
 * Components configuration
 */

/**
 * AppAlert and AppSnackBarAlert components
 */
const APP_ALERT_SEVERITY = 'error'; // 'error' | 'info'| 'success' | 'warning'
const APP_ALERT_VARIANT = 'filled'; // 'filled' | 'outlined' | 'standard'

/**
 * AppLink component
 */
export const APP_LINK_COLOR = 'textSecondary'; // 'primary' // 'secondary'
export const APP_LINK_UNDERLINE = 'hover'; // 'always

/**
 * AppSection component
 */
const APP_SECTION_VARIANT = 'subtitle2'; // 'subtitle1' | 'body1' | 'h6'

/**
 * AppSnackBar and AppSnackBarProvider components
 */
const APP_SNACKBAR_MAX_COUNT = 5; // Used in AppSnackBarProvider from notistack npm
const APP_SNACKBAR_AUTO_HIDE_DURATION = 3000; // Set to null if want to disable AutoHide feature
const APP_SNACKBAR_ANCHOR_ORIGIN_VERTICAL = 'bottom'; // 'bottom | 'top'
const APP_SNACKBAR_ANCHOR_ORIGIN_HORIZONTAL = 'center'; // 'center' | 'left' | 'right'
