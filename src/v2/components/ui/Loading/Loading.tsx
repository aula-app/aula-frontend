interface Props {
  /** Announced and shown beside the spinner. */
  label: string;
  /** What is being waited for, when the label alone does not say it. */
  detail?: string;
  className?: string;
  'data-testid'?: string;
}

const Loading = ({ label, detail, className = '', 'data-testid': dataTestId }: Props) => (
  <div
    role="status"
    aria-live="polite"
    className={`flex flex-col items-center justify-center gap-3 py-12 text-center ${className}`}
    data-testid={dataTestId}
  >
    <span
      aria-hidden="true"
      className="size-8 rounded-full border-2 border-current/25 border-t-current motion-safe:animate-spin"
    />
    <span className="font-bold">{label}</span>
    {!!detail && <span className="max-w-prose text-sm opacity-70">{detail}</span>}
  </div>
);

export default Loading;
