import Button from '@/v2/components/button/Button';
import TextInput from '@/v2/components/input/TextInput';
import { useTranslation } from 'react-i18next';

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isEditing: boolean;
  onEditClick: () => void;
  disabled?: boolean;
};

const InstanceCodeField = ({ value, onChange, error, isEditing, onEditClick, disabled }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <TextInput
          label={t('v2.form.code.label')}
          required
          autoCapitalize="none"
          error={error}
          helperText={isEditing ? t('v2.page.code.hint') : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing || disabled}
          data-testid="instance-code"
        />
      </div>
      {!isEditing && (
        <Button
          type="button"
          outlined
          color="secondary"
          onClick={onEditClick}
          disabled={disabled}
          data-testid="edit-instance-code"
        >
          {t('v2.ui.button.edit')}
        </Button>
      )}
    </div>
  );
};

export default InstanceCodeField;
