import { FieldLabel, fieldBoxClasses, listBoxClasses, popoverClasses } from '@/v2/components/input/Field';
import { SelectOption } from '@/v2/components/input/SelectInput';
import Icon from '@/v2/components/ui/Icon';
import {
  ComboBox as AriaComboBox,
  Button,
  ComboBoxValue,
  Input,
  Key,
  ListBox,
  ListBoxItem,
  Popover,
  Tag,
  TagGroup,
  TagList,
} from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface ComboBoxProps {
  label: string;
  /** Shown inside the empty field; keeps the label floated above it. */
  placeholder?: string;
  /** Every pickable option, including the selected ones. */
  options: SelectOption[];
  /** Selected option values. */
  value: string[];
  onChange: (value: string[]) => void;
  /** Accessible name for the list of selected tags. */
  tagsLabel: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

const ComboBox = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  tagsLabel,
  loading = false,
  disabled = false,
  className,
  'data-testid': dataTestId,
}: ComboBoxProps) => {
  const { t } = useTranslation();

  return (
    <AriaComboBox
      selectionMode="multiple"
      value={value}
      onChange={(keys: Key[]) => onChange(keys.map(String))}
      defaultItems={options}
      menuTrigger="focus"
      allowsEmptyCollection
      isDisabled={disabled || loading || options.length === 0}
      className={twMerge('group/combobox relative flex flex-col gap-2', className)}
    >
      <div className="relative">
        <Input
          placeholder={placeholder ?? ' '}
          data-testid={dataTestId}
          className={twMerge(fieldBoxClasses({ hasEnd: true }), 'placeholder:text-muted')}
        />
        <FieldLabel floated={placeholder ? true : undefined}>{label}</FieldLabel>
        <Button className="absolute inset-y-0 right-0 flex items-center pl-2 pr-3 cursor-pointer outline-none data-disabled:cursor-not-allowed">
          <Icon
            type="chevronDown"
            size="0.75em"
            className="text-muted mt-0.5 transition-transform duration-200 group-data-open/combobox:rotate-180"
          />
        </Button>
      </div>

      <ComboBoxValue<SelectOption>>
        {({ selectedItems }) => (
          <TagGroup aria-label={tagsLabel} onRemove={(keys) => onChange(value.filter((key) => !keys.has(key)))}>
            <TagList
              items={selectedItems.filter((item): item is SelectOption => item != null)}
              data-testid={dataTestId ? `${dataTestId}-tags` : undefined}
              className="flex flex-wrap gap-1 empty:hidden"
            >
              {(item) => (
                <Tag
                  id={item.value}
                  textValue={item.label}
                  data-testid={dataTestId ? `${dataTestId}-tag-${item.value}` : undefined}
                  className={twMerge(
                    'flex max-w-full items-center gap-1 rounded-full border border-input-border py-0.5 pl-3 pr-1 bg-shadow',
                    'text-xs text-foreground cursor-default outline-none transition-colors',
                    'data-hovered:border-input-border-hover',
                    'data-focus-visible:outline-2 data-focus-visible:outline-offset-1 data-focus-visible:outline-primary',
                    'data-disabled:opacity-50'
                  )}
                >
                  <span className="truncate">{item.label}</span>
                  <Button
                    slot="remove"
                    data-testid={dataTestId ? `${dataTestId}-remove-${item.value}` : undefined}
                    className={twMerge(
                      'flex shrink-0 items-center justify-center rounded-full p-0.5 text-muted cursor-pointer',
                      'outline-none transition-colors data-hovered:bg-shadow data-pressed:bg-shadow',
                      'data-focus-visible:outline-2 data-focus-visible:outline-primary'
                    )}
                  >
                    <Icon type="close" size="0.875rem" />
                  </Button>
                </Tag>
              )}
            </TagList>
          </TagGroup>
        )}
      </ComboBoxValue>

      <Popover
        placement="bottom start"
        offset={4}
        maxHeight={240}
        className={twMerge('w-(--trigger-width) flex', popoverClasses)}
      >
        <ListBox<SelectOption>
          data-testid={dataTestId ? `${dataTestId}-list` : undefined}
          className={twMerge(listBoxClasses, 'flex-1')}
          renderEmptyState={() => (
            <div className="px-3 py-2 text-sm text-muted">{t('v2.form.autocomplete.noOptions')}</div>
          )}
        >
          {(option) => (
            <ListBoxItem
              id={option.value}
              textValue={option.label}
              data-testid={dataTestId ? `${dataTestId}-option-${option.value}` : undefined}
              className={twMerge(
                'group flex items-center gap-2 px-3 py-2 text-sm cursor-pointer outline-none transition-colors duration-100 text-muted',
                'data-selected:text-current data-selected:font-medium data-focused:bg-primary/10'
              )}
            >
              <span className="flex-1 truncate">{option.label}</span>
              <Icon type="check" size="1em" className="invisible shrink-0 group-data-selected:visible" />
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
};

ComboBox.displayName = 'ComboBox';

export default ComboBox;
