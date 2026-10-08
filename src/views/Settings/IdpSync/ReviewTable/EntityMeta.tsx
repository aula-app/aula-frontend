import Icon from '@/components/new/Icon/Icon';
import Avatar from '@/v2/components/idea/Avatar';
import { ReactNode } from 'react';

interface Props {
  name: string;
  detail?: string;
  /** Outside the detail's truncation, which would clip a popup. */
  detailEnd?: ReactNode;
  /** Name for the initials; omit for no avatar. */
  avatar?: string;
  avatarSrc?: string;
  /** Third line: the person's classes on this side. */
  classes?: string;
}

const EntityMeta = ({ name, detail, detailEnd, avatar, avatarSrc, classes }: Props) => (
  <span className="flex items-center gap-2 min-w-0">
    {!!avatar && <Avatar name={avatar} src={avatarSrc} size={28} />}
    <span className="flex flex-col min-w-0">
      <span className="truncate font-bold">{name}</span>
      {(!!detail || !!detailEnd) && (
        <span className="flex min-w-0 items-center gap-1 text-xs">
          {!!detail && <span className="truncate opacity-70">{detail}</span>}
          {detailEnd}
        </span>
      )}
      {!!classes && (
        <span className="flex min-w-0 items-center gap-1 text-xs opacity-70" title={classes}>
          <Icon type="rooms" size="1em" className="shrink-0" />
          <span className="truncate">{classes}</span>
        </span>
      )}
    </span>
  </span>
);

export default EntityMeta;
