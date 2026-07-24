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
            className={`-mr-4 last:mr-0 p-0.5 bg-${phaseType} hover:bg-${phaseType}-active active:bg-${phaseType}-active has-[a:focus-visible]:bg-foreground transition-[flex] duration-300 ease-in-out ${isExpanded ? 'flex-3 z-10' : `${index === displayPhases.length - 1 ? 'flex-[0.75]' : 'flex-1'} z-0`}`}
            style={{ clipPath: getClipPath(index, displayPhases.length) }}
          >
            <Link
              to={`/room/${room}/phase/${displayPhase}`}
              disabled={isActive}
              aria-label={t('v2.ui.moveToPhase', { phase: t(`phases.${phaseType}`) })}
              aria-current={isActive ? 'page' : undefined}
              data-testid={`link-to-phase-${displayPhase}`}
              className={`flex items-center justify-center rounded-none h-9 w-full px-6 text-foreground no-underline bg-${phaseType} hover:bg-${phaseType}-active active:bg-${phaseType}-active focus-visible:outline-none transition-colors duration-150`}
              style={{ clipPath: getClipPath(index, displayPhases.length) }}
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
