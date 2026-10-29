import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { RowKind } from './candidates';
import OutcomeTag from './OutcomeTag';
import { CARD, CONTENT, toneFor } from './styles';

const KINDS: RowKind[] = ['pending', 'merge', 'create', 'keep'];

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
        className="mb-0! grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4"
        data-testid="idp-review-legend"
      >
        {KINDS.map((kind) => (
          <div key={kind} className={`${CARD} ${toneFor(kind)} ${CONTENT} flex flex-col gap-2`}>
            <OutcomeTag kind={kind} as="dt" className="self-start" />
            <dd className="mb-0!">{t(`v2.ui.idpSync.legend.${kind}`)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default Legend;
