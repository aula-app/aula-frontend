import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { RowKind } from './candidates';
import OutcomeTag from './OutcomeTag';
import { CARD, PLAIN, toneFor } from './styles';

const KINDS: RowKind[] = ['pending', 'merge', 'create', 'keep'];

/** pt clears the tag riding the top border, as the cells do. */
const ITEM = `${CARD} relative px-3 pt-4 pb-2`;
const ON_BORDER = 'absolute top-0 right-0 z-1 translate-x-1 -translate-y-1/2';

const Legend: React.FC = () => {
  const { t } = useTranslation();
  const titleId = useId();

  return (
    <div className="flex flex-col gap-3">
      <p id={titleId} className="mb-0! text-sm font-bold">
        {t('v2.ui.idpSync.legendTitle')}
      </p>

      <dl
        aria-labelledby={titleId}
        className="mb-0! grid auto-rows-fr grid-cols-1 gap-x-2 gap-y-3 text-xs sm:grid-cols-2 lg:grid-cols-3"
        data-testid="idp-review-legend"
      >
        {KINDS.map((kind) => (
          <div key={kind} className={`${ITEM} ${toneFor(kind)}`}>
            <OutcomeTag kind={kind} as="dt" className={ON_BORDER} />
            <dd className="mb-0!">{t(`v2.ui.idpSync.legend.${kind}`)}</dd>
          </div>
        ))}

        <div className={`${ITEM} ${PLAIN} border-dashed`}>
          {/* The dashed card is the whole sample: an empty slot carries no tag. */}
          <dt className="sr-only">{t('v2.ui.idpSync.outcome.empty')}</dt>
          <dd className="mb-0!">{t('v2.ui.idpSync.legend.empty')}</dd>
        </div>
      </dl>
    </div>
  );
};

export default Legend;
