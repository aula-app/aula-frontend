import { getIdeasByRoom } from '@/services/ideas';
import IconButton from '@/v2/components/button/IconButton';
import AutocompleteInput from '@/v2/components/input/AutocompleteInput';
import { SelectOption } from '@/v2/components/input/SelectInput';
import Icon from '@/v2/components/ui/Icon/Icon';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface IdeaFieldProps {
  /** Room the pickable ideas come from. */
  roomId: string;
  /** Ideas currently assigned, as `{ value: hash_id, label: title }`. */
  value: SelectOption[];
  onChange: (ideas: SelectOption[]) => void;
  /** The assigned ideas are still being fetched. */
  loadingValue?: boolean;
  disabled?: boolean;
  'data-testid'?: string;
}

/** Picks ideas out of a room and lists the picked ones, each removable. */
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

  // The room only lists unassigned ideas, so a removed one has to be kept to stay pickable.
  const [removed, setRemoved] = useState<SelectOption[]>([]);

  const selectedIds = value.map((idea) => idea.value);
  const pool = options.concat(removed.filter((idea) => !options.some((option) => option.value === idea.value)));
  const available = pool.filter((option) => !selectedIds.includes(option.value));

  const add = (ideaId: string) => {
    const option = pool.find((o) => o.value === ideaId);
    if (option) onChange([...value, option]);
  };

  const remove = (ideaId: string) => {
    const option = value.find((idea) => idea.value === ideaId);
    if (option) setRemoved((current) => (current.some((o) => o.value === ideaId) ? current : [...current, option]));
    onChange(value.filter((idea) => idea.value !== ideaId));
  };

  return (
    <div className="flex flex-col gap-1">
      <AutocompleteInput
        label={t('v2.ui.actions.add', { var: t('v2.scopes.ideas.singular') })}
        options={available}
        onSelect={add}
        loading={loading}
        disabled={disabled}
        data-testid={dataTestId}
      />

      {loadingValue && (
        <p role="status" className="px-1 text-xs text-muted">
          {t('status.loading')}
        </p>
      )}

      {value.length > 0 && (
        <ul
          aria-label={t('v2.scopes.boxes.ideasInBox')}
          className="flex max-h-40 flex-col gap-0.5 overflow-y-auto"
          data-testid={`${dataTestId}-list`}
        >
          {value.map((idea) => (
            <li key={idea.value} className="flex items-stretch gap-0.5 rounded-md bg-shadow">
              <span className={twMerge('flex min-w-0 flex-1 items-center px-3 py-1.5 text-sm')}>
                <span className="truncate">{idea.label}</span>
              </span>
              <IconButton
                type="button"
                aria-label={t('v2.ui.actions.remove', { var: idea.label })}
                disabled={disabled}
                onClick={() => remove(idea.value)}
                className={twMerge('aspect-auto shrink-0 px-2')}
                data-testid={`${dataTestId}-remove-${idea.value}`}
              >
                <Icon type="close" size="1.1rem" />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IdeaField;
