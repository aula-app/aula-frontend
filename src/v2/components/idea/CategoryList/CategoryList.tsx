import { twMerge } from 'tailwind-merge';
import Chip from '@/v2/components/button/Chip/Chip';

export interface Category {
  id: string;
  label: string;
}

interface CategoryListProps {
  /** Categories to render as chips. Renders nothing when empty. */
  categories?: Category[];
  /** Optional handler; when provided, chips act as clickable filters. */
  onSelect?: (category: Category) => void;
  className?: string;
}

/**
 * Horizontal, wrapping list of category chips.
 *
 * Scaffold: ideas currently expose no category data, so this renders `null`
 * until a `categories` array is passed in. The interface is ready for wiring.
 */
const CategoryList = ({ categories, onSelect, className }: CategoryListProps) => {
  if (!categories || categories.length === 0) return null;

  return (
    <ul className={twMerge('flex flex-wrap gap-1', className)}>
      {categories.map((category) => (
        <li key={category.id}>
          <Chip condensed onClick={onSelect ? () => onSelect(category) : undefined}>
            {category.label}
          </Chip>
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
