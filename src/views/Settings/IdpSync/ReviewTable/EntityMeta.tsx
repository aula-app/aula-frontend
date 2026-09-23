import Avatar from '@/v2/components/idea/Avatar';
import { ReactNode } from 'react';

interface Props {
  name: string;
  detail?: string;
  /** Outside the detail's truncation, which would clip a popup. */
  detailEnd?: ReactNode;
  /** Name for the initials; omit for no avatar. */
  avatar?: string;
}

const EntityMeta = ({ name, detail, detailEnd, avatar }: Props) => (
  <span className="flex items-center gap-2 min-w-0">
    {!!avatar && <Avatar name={avatar} size={28} />}
    <span className="flex flex-col min-w-0">
      <span className="truncate font-bold">{name}</span>
      {(!!detail || !!detailEnd) && (
        <span className="flex min-w-0 items-center gap-1 text-xs">
          {!!detail && <span className="truncate opacity-70">{detail}</span>}
          {detailEnd}
        </span>
      )}
    </span>
  </span>
);

export default EntityMeta;
