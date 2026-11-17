import Icon from '@/v2/components/ui/Icon/Icon';
import { RoomPhases } from '@/types/SettingsTypes';
import { phases } from '@/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Link from '../../navigation/Link';

const ARROW_SIZE = 16;

// Focus-ring geometry: the ring is the sliver between the wrapper's chevron and an
// inward-offset copy of it on the link. A uniform 2px ring needs each vertex moved in
// perpendicular by the ring width, not by a flat 2px inset — otherwise the diagonals
// stop being parallel and the ring tapers at the arrow point/notch. Values below are the
// offset vertices for a 40px-tall bar, a 16px arrow and a 2px ring (see PhaseBar tests).
const RING_WIDTH = 2;
const APEX_OFFSET = 2.561; // arrow point/notch shifted inward along its bisector
const CORNER_NEAR = 4.161; // corner where a diagonal meets the edge, near a concave notch
const CORNER_FAR = 16.961; // corner where a diagonal meets the edge, opposite a convex tip

const isValidPhase = (phase: string): phase is `${RoomPhases}` => Object.keys(phases).includes(phase);

const displayPhases = Object.keys(phases) as `${RoomPhases}`[];

function getClipPath(index: number, total: number): string {
  const leftArrow = index > 0 ? `${ARROW_SIZE}px 50%, ` : '';
  const rightArrow =
    index < total - 1
      ? `calc(100% - ${ARROW_SIZE}px) 100%, 100% 50%, calc(100% - ${ARROW_SIZE}px) 0%`
      : `100% 100%, 100% 0%`;
  return `polygon(0% 0%, ${leftArrow}0% 100%, ${rightArrow})`;
}

// Same chevron as getClipPath, offset inward by RING_WIDTH so the gap to the wrapper
// forms a uniform focus ring that traces the arrow.
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

interface PhaseBarProps {
  room: string;
}

function PhaseBar({ room }: PhaseBarProps) {
  const { t } = useTranslation();
  const { phase } = useParams();
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  const currentPhase = phase && isValidPhase(phase) ? phase : '0';

  return (
    <div
      className="flex w-full overflow-hidden min-h-10 print:hidden"
      role="navigation"
      aria-label={t('v2.ui.phases')}
      onMouseLeave={() => setHoveredPhase(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHoveredPhase(null);
      }}
    >
      {displayPhases.map((displayPhase, index) => {
        const phaseType = phases[displayPhase];
        const isActive = currentPhase === displayPhase;
        const isExpanded = hoveredPhase !== null ? hoveredPhase === displayPhase : isActive;

        return (
          <div
            key={displayPhase}
            className={`-mr-4 last:mr-0 bg-${phaseType} hover:bg-${phaseType}-active active:bg-${phaseType}-active has-[a:focus-visible]:bg-foreground transition-[flex] duration-300 ease-in-out ${isExpanded ? 'flex-3 z-10' : `${index === displayPhases.length - 1 ? 'flex-[0.75]' : 'flex-1'} z-0`}`}
            style={{ clipPath: getClipPath(index, displayPhases.length) }}
          >
            <Link
              to={`/room/${room}/phase/${displayPhase}`}
              disabled={isActive}
              aria-label={t('v2.ui.moveToPhase', { phase: t(`phases.${phaseType}`) })}
              aria-current={isActive ? 'page' : undefined}
              data-testid={`link-to-phase-${displayPhase}`}
              className={`flex items-center justify-center rounded-none h-10 w-full px-6 text-foreground no-underline bg-${phaseType} hover:bg-${phaseType}-active active:bg-${phaseType}-active focus-visible:outline-none transition-colors duration-150`}
              style={{ clipPath: getRingClipPath(index, displayPhases.length) }}
              onMouseEnter={() => setHoveredPhase(displayPhase)}
              onFocus={() => setHoveredPhase(displayPhase)}
            >
              <Icon type={phaseType} size="1.25rem" aria-hidden="true" />
              <span
                className={`grid transition-[grid-template-columns] duration-300 ease-in-out ${isExpanded ? 'grid-cols-[1fr]' : 'grid-cols-[0fr]'}`}
              >
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium pl-1.5">
                  {t(`phases.${phaseType}`)}
                </span>
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

PhaseBar.displayName = 'PhaseBar';

export default PhaseBar;
