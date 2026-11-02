import Badge from '@/v2/components/ui/Badge';
import { useMessageCount, useUpdateCount } from '@/v2/hooks/useActivityCounts';

const CountChip = ({ count, className }: { count?: number; className: string }) =>
  count ? (
    <>
      <Badge inline count={count} className={className} />
      <span className="sr-only">{`, ${count}`}</span>
    </>
  ) : null;

export const MessagesChip = () => <CountChip count={useMessageCount()} className="bg-info text-info-fg" />;

export const UpdatesChip = () => <CountChip count={useUpdateCount()} className="bg-discussion text-discussion-fg" />;
