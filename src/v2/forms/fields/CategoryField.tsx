import { getCategories } from '@/services/categories';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SelectInput from '@/v2/components/input/SelectInput';

interface CategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface CategoryOption {
  value: string;
  label: string;
}

const CategoryField: React.FC<CategoryFieldProps> = ({ value, onChange, disabled = false }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<CategoryOption[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const response = await getCategories();
      setLoading(false);
      if (!response.data) return;
      const categoryOptions = response.data.map((category) => ({
        value: String(category.id),
        label: category.name,
      }));
      setOptions(categoryOptions);
    };

    fetchCategories();
  }, []);

  // Don't render if no categories available
  if (!loading && options.length === 0) {
    return null;
  }

  return (
    <SelectInput
      label={t('scopes.categories.name')}
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
    />
  );
};

export default CategoryField;
