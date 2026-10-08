import Icon from '@/components/new/Icon/Icon';
import Tooltip from '@/v2/components/ui/Tooltip';
import { useTranslation } from 'react-i18next';
import { Member } from './candidates';
import { SOURCE_TEXT } from './styles';

interface Props {
  /** Already sorted. */
  members: Member[];
  /** Referenced by the card's aria-describedby. */
  id?: string;
  /** Renders the icon as a focusable button with this name. */
  label?: string;
  'data-testid'?: string;
}

const TRIGGER = 'inline-flex cursor-help opacity-70 hover:opacity-100';

const MemberCount = ({ members, id, label, 'data-testid': testId }: Props) => {
  const { t } = useTranslation();
  const icon = <Icon type="about" size="1.2em" />;

  return (
    <>
      <span className="truncate opacity-70">{t('v2.ui.idpSync.members', { count: members.length })}</span>
      {members.length > 0 && (
        // Keeps clicks from picking the card.
        <span className="inline-flex" onClick={(event) => event.stopPropagation()} data-keeps-pick>
          <Tooltip
            id={id}
            tapToShow
            className="px-3 text-text-primary"
            content={
              <ul
                className="flex max-h-48 flex-col gap-1 overflow-y-auto text-sm"
                data-testid={testId ? `${testId}-list` : undefined}
              >
                {members.map(({ name, kind }, index) => (
                  <li key={`${index}-${name}`} className={`flex items-center gap-1.5 ${SOURCE_TEXT[kind]}`}>
                    <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-current" />
                    <span className="truncate">{name}</span>
                    <span className="sr-only">, {t(`v2.ui.idpSync.memberKind.${kind}`)}</span>
                  </li>
                ))}
              </ul>
            }
          >
            {label ? (
              <button type="button" aria-label={label} className={`${TRIGGER} rounded-full`} data-testid={testId}>
                {icon}
              </button>
            ) : (
              <span aria-hidden="true" className={TRIGGER} data-testid={testId}>
                {icon}
              </span>
            )}
          </Tooltip>
        </span>
      )}
    </>
  );
};

export default MemberCount;
