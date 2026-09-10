import Icon from '@/components/new/Icon/Icon';

const ARROW_SIZE = 12;
const RING_WIDTH = 0;
const APEX_OFFSET = 2.5; // arrow point/notch, shifted inward along its bisector
const CORNER_NEAR = 4; // corner where a diagonal meets the edge, beside a concave notch
const CORNER_FAR = 13; // corner where a diagonal meets the edge, opposite a convex tip

function getClipPath(index: number, total: number): string {
  const leftArrow = index > 0 ? `${ARROW_SIZE}px 50%, ` : '';
  const rightArrow =
    index < total - 1
      ? `calc(100% - ${ARROW_SIZE}px) 100%, 100% 50%, calc(100% - ${ARROW_SIZE}px) 0%`
      : `100% 100%, 100% 0%`;

  return `polygon(0% 0%, ${leftArrow}0% 100%, ${rightArrow})`;
}

// The same chevron, offset inward by RING_WIDTH.
function getRingClipPath(index: number, total: number): string {
  const hasLeftArrow = index > 0;
  const hasRightArrow = index < total - 1;

  const topLeft = hasLeftArrow ? `${CORNER_NEAR}px ${RING_WIDTH}px` : `${RING_WIDTH}px ${RING_WIDTH}px`;
  const leftNotch = hasLeftArrow ? `${ARROW_SIZE + APEX_OFFSET}px 50%, ` : '';
  const bottomLeft = hasLeftArrow
    ? `${CORNER_NEAR}px calc(100% - ${RING_WIDTH}px)`
    : `${RING_WIDTH}px calc(100% - ${RING_WIDTH}px)`;
  const rightArrow = hasRightArrow
    ? `calc(100% - ${CORNER_FAR}px) calc(100% - ${RING_WIDTH}px), calc(100% - ${APEX_OFFSET}px) 50%, calc(100% - ${CORNER_FAR}px) ${RING_WIDTH}px`
    : `calc(100% - ${RING_WIDTH}px) calc(100% - ${RING_WIDTH}px), calc(100% - ${RING_WIDTH}px) ${RING_WIDTH}px`;

  return `polygon(${topLeft}, ${leftNotch}${bottomLeft}, ${rightArrow})`;
}

interface Props {
  steps: string[];
  current: number;
  label: string;
  className?: string;
  'data-testid'?: string;
}

const Stepper = ({ steps, current, label, className = '', 'data-testid': dataTestId }: Props) => (
  <ol
    className={`flex w-full overflow-hidden min-h-6 print:hidden ${className}`}
    aria-label={label}
    data-testid={dataTestId}
  >
    {steps.map((step, index) => {
      const isCurrent = index === current;
      const isDone = index < current;

      return (
        <li
          key={step}
          aria-current={isCurrent ? 'step' : undefined}
          className={`-mr-3 last:mr-0 h-8 transition-[flex] duration-300 ease-in-out ${
            isCurrent ? 'flex-3 z-10' : `${index === steps.length - 1 ? 'flex-[0.9]' : 'flex-1'} z-0`
          }`}
          style={{ clipPath: getClipPath(index, steps.length) }}
        >
          <span
            className={`flex h-full w-full items-center justify-center gap-1 ${!isCurrent ? 'bg-current/15' : ''} px-3`}
            style={{ clipPath: getRingClipPath(index, steps.length) }}
          >
            {isDone && <Icon type="check" size="1em" className="shrink-0" />}
            <span className={`overflow-hidden text-ellipsis whitespace-nowrap ${isCurrent ? 'font-bold' : ''}`}>
              {step}
            </span>
          </span>
        </li>
      );
    })}
  </ol>
);

export default Stepper;
