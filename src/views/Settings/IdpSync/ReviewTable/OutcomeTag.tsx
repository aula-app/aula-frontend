import Icon from '@/components/new/Icon/Icon';
import { useTranslation } from 'react-i18next';
import { RowKind } from './candidates';
import { ICON, TAG } from './styles';

interface Props {
  kind: RowKind;
  /** Layout from the parent; the tag owns only its own look. */
  className?: string;
  as?: 'span' | 'dt';
  'data-testid'?: string;
}

const OutcomeTag = ({ kind, className = '', as: Tag = 'span', 'data-testid': testId }: Props) => {
  const { t } = useTranslation();

  return (
    <Tag
      className={`${TAG[kind]} flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold whitespace-nowrap ${className}`}
      data-testid={testId}
    >
      <Icon type={ICON[kind]} size="1.1em" />
      {t(`v2.ui.idpSync.outcome.${kind}`)}
    </Tag>
  );
};

export default OutcomeTag;
