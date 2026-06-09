import Icon from '@/v2/components/ui/Icon/Icon';
import { RoomPhases } from '@/types/SettingsTypes';
import { phases } from '@/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Link from '../../navigation/Link';

const ARROW_SIZE = 16;

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
            className={`-mr-4 last:mr-0 transition-[flex] duration-300 ease-in-out ${isExpanded ? 'flex-3 z-10' : 'flex-1 z-0'}`}
          >
            <Link
              to={`/room/${room}/phase/${displayPhase}`}
              disabled={isActive}
              aria-current={isActive ? 'page' : undefined}
              data-testid={`link-to-phase-${displayPhase}`}
              className={`flex items-center justify-center gap-1.5 h-10 w-full px-6 text-text-primary no-underline bg-${phaseType} hover:brightness-90 active:brightness-75 focus-visible:outline-2 focus-visible:outline-offset-0 transition-[filter] duration-150`}
              style={{ clipPath: getClipPath(index, displayPhases.length) }}
              onMouseEnter={() => setHoveredPhase(displayPhase)}
              onFocus={() => setHoveredPhase(displayPhase)}
            >
              <Icon type={phaseType} size="1.25rem" aria-hidden="true" />
              {isExpanded && <span className="text-sm font-medium truncate">{t(`phases.${phaseType}`)}</span>}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

PhaseBar.displayName = 'PhaseBar';

export default PhaseBar;
