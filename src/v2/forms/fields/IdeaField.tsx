import { getIdeasByRoom } from '@/services/ideas';
import ComboBox from '@/v2/components/input/ComboBox';
import { SelectOption } from '@/v2/components/input/SelectInput';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IdeaFieldProps {
  roomId: string;
  value: SelectOption[];
  onChange: (ideas: SelectOption[]) => void;
  loadingValue?: boolean;
  disabled?: boolean;
  'data-testid'?: string;
}

const uniqueOptions = (list: SelectOption[]) =>
  list.filter((option, index) => list.findIndex((other) => other.value === option.value) === index);

const IdeaField = ({
  roomId,
  value,
  onChange,
  loadingValue = false,
  disabled = false,
  'data-testid': dataTestId = 'idea-field',
}: IdeaFieldProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (!roomId) return;

    let active = true;
    setLoading(true);
    getIdeasByRoom(roomId)
      .then((response) => {
        if (!active) return;
        const roomIdeas = Array.isArray(response.data) ? response.data : [];
        setOptions(roomIdeas.map((idea) => ({ value: idea.hash_id, label: idea.title })));
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [roomId]);

  // The room only lists unassigned ideas.
  const [removed, setRemoved] = useState<SelectOption[]>([]);
  const pool = uniqueOptions([...options, ...value, ...removed]);

  const handleChange = (ids: string[]) => {
    const dropped = value.filter((idea) => !ids.includes(idea.value));
    if (dropped.length > 0) setRemoved((current) => uniqueOptions([...current, ...dropped]));
    onChange(
      pool.filter((option) => ids.includes(option.value)).sort((a, b) => ids.indexOf(a.value) - ids.indexOf(b.value))
    );
  };

  return (
    <div className="flex flex-col gap-1">
      <ComboBox
        label={t('scopes.ideas.plural')}
        placeholder={t('v2.ui.actions.select', { var: t('v2.scopes.ideas.plural') })}
        tagsLabel={t('v2.scopes.boxes.ideasInBox')}
        options={pool}
        value={value.map((idea) => idea.value)}
        onChange={handleChange}
        loading={loading}
        disabled={disabled}
        data-testid={dataTestId}
      />

      {loadingValue && (
        <p role="status" className="px-1 text-xs text-muted">
          {t('status.loading')}
        </p>
      )}
    </div>
  );
};

export default IdeaField;
