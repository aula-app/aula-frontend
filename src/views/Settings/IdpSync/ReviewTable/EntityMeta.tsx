import Icon from '@/components/new/Icon/Icon';
import Avatar from '@/v2/components/idea/Avatar';
import { DIM } from './styles';
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

const EntityMeta = ({ name, detail, detailEnd, avatar, avatarSrc, classes }: Props) => {
  /** A record with no display name repeats its own name here. */
  const second = detail === name ? undefined : detail;

  return (
    <span className="flex items-center gap-2 min-w-0">
      {!!avatar && <Avatar name={avatar} src={avatarSrc} size={28} />}
      <span className="flex flex-col min-w-0">
        <span className="truncate font-bold">{name}</span>
        {(!!second || !!detailEnd) && (
          <span className="flex min-w-0 items-center gap-1 text-xs">
            {!!second && <span className={`truncate ${DIM}`}>{second}</span>}
            {detailEnd}
          </span>
        )}
        {!!classes && (
          <span className={`flex min-w-0 items-center gap-1 text-xs ${DIM}`} title={classes}>
            <Icon type="rooms" size="1em" className="shrink-0" />
            <span className="truncate">{classes}</span>
          </span>
        )}
      </span>
    </span>
  );
};

export default EntityMeta;
