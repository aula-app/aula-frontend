import Icon from '@/components/new/Icon/Icon';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { RowKind } from './candidates';
import OutcomeTag from './OutcomeTag';
import { CARD, CONTENT, PLAIN, toneFor } from './styles';

const KINDS: RowKind[] = ['pending', 'merge', 'create', 'keep'];

const ITEM = `${CARD} ${CONTENT} flex flex-col gap-2`;

const Legend: React.FC = () => {
  const { t } = useTranslation();
  const titleId = useId();

  return (
    <div className="flex flex-col gap-2">
      <p id={titleId} className="mb-0! text-sm font-bold">
        {t('v2.ui.idpSync.legendTitle')}
      </p>

      <dl
        aria-labelledby={titleId}
        className="mb-0! grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 lg:grid-cols-3"
        data-testid="idp-review-legend"
      >
        {KINDS.map((kind) => (
          <div key={kind} className={`${ITEM} ${toneFor(kind)}`}>
            <OutcomeTag kind={kind} as="dt" className="self-start" />
            <dd className="mb-0!">{t(`v2.ui.idpSync.legend.${kind}`)}</dd>
          </div>
        ))}

        <div className={`${ITEM} ${PLAIN} border-dashed`}>
          <dt className="flex items-center gap-1 self-start rounded-full border border-dashed border-current/70 px-2 py-0.5 text-xs font-bold whitespace-nowrap">
            <Icon type="add" size="1.1em" />
            {t('v2.ui.idpSync.outcome.empty')}
          </dt>
          <dd className="mb-0!">{t('v2.ui.idpSync.legend.empty')}</dd>
        </div>
      </dl>
    </div>
  );
};

export default Legend;
