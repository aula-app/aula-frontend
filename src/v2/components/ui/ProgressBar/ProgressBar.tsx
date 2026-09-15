import { PhaseType } from '@/types/SettingsTypes';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
  /** Filled share of the track, 0–100. Clamped. */
  value: number;
  /** Palette: the track is `bg-{color}`, the fill `bg-{color}-active`. */
  color: PhaseType;
  /** Accessible name — the bar's own content is treated as decorative. */
  label: string;
  /** Threshold to mark on the track, 0–100, e.g. a quorum. */
  marker?: number;
  /** Rendered inside the marker. Keep it to a few characters — the triangle narrows fast. */
  markerLabel?: ReactNode;
  /** Rides the leading edge of the fill, like the percentage in a loading bar. */
  valueLabel?: ReactNode;
  /** Pinned to the end of the track, and dropped once the fill or marker crowds it. */
  endLabel?: ReactNode;
  /** Pinned inside the left of the bar, e.g. an icon and a count. */
  children?: ReactNode;
  /** Corner radius is the caller's, since bars sit both standalone and as card footers. */
  className?: string;
}

const clamp = (value: number) => Math.min(100, Math.max(0, value));

// Labels are sized in rem while the track is measured in %, so overlap cannot be computed
// without reading back layout. These are the shares at which they start to collide on a
// typical bar; they trade a little early hiding for never having to measure.

/** Below this, the fill is too narrow to hold its own label, which sits beside it instead. */
const LABEL_FITS = 25;
/** Past this, the fill has reached the end label. */
const FILL_CROWDS_END = 88;
/** Past this, the marker has reached the end label — sooner than the fill, since its flag
 *  extends to the right of the threshold it marks. */
const MARKER_CROWDS_END = 70;

/** Inline progress track shared by every progress and quorum readout. */
const ProgressBar = ({
  value,
  color,
  label,
  marker,
  markerLabel,
  valueLabel,
  endLabel,
  children,
  className,
}: ProgressBarProps) => {
  const progress = clamp(value);
  const threshold = marker === undefined ? undefined : clamp(marker);
  const labelInside = valueLabel !== undefined && progress >= LABEL_FITS;
  const crowded = progress >= FILL_CROWDS_END || (threshold ?? 0) >= MARKER_CROWDS_END;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={twMerge(
        'relative flex items-center gap-1 overflow-hidden px-2 py-1 text-sm font-medium',
        `bg-${color}-light`,
        `text-${color}-fg`,
        className
      )}
    >
      <div
        className={twMerge(
          'absolute inset-y-0 left-0 flex items-center justify-end transition-[width] duration-500',
          // min-w-max keeps the fill from shrinking behind its own label at low values.
          valueLabel !== undefined && 'min-w-max px-2',
          `bg-${color}-active`
        )}
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      >
        {valueLabel}
      </div>

      {threshold !== undefined && (
        <span
          className="absolute inset-y-0 flex justify-center bg-background pt-0.5 text-xs leading-none"
          style={{
            // Centred on the threshold, held inside the track at either extreme.
            left: `clamp(0px, calc(${threshold}%), calc(100% - 1.5rem))`,
            clipPath: 'polygon(0 0, 100% 0, 0% 100%)',
          }}
          aria-hidden="true"
        >
          <span className="pl-1 pr-4 text-xs -mt-0.5">{markerLabel}</span>
        </span>
      )}

      {endLabel !== undefined && !crowded && (
        <span className="absolute right-2.5" aria-hidden="true">
          {endLabel}
        </span>
      )}

      {children !== undefined && (
        <span className="relative flex items-center gap-1" aria-hidden="true">
          {children}
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
