import Avatar from '@/v2/components/idea/Avatar';

interface Props {
  name: string;
  detail?: string;
  /**
   * Name the initials are drawn from. Omitted where there is no avatar to show:
   * the provider supplies none, and a room has none at all.
   */
  avatar?: string;
}

/** A name over its secondary identifier. */
const Party = ({ name, detail, avatar }: Props) => (
  <span className="flex items-center gap-2 min-w-0">
    {!!avatar && <Avatar name={avatar} size={28} />}
    <span className="flex flex-col min-w-0">
      <span className="truncate font-bold">{name}</span>
      {!!detail && <span className="truncate text-xs opacity-70">{detail}</span>}
    </span>
  </span>
);

export default Party;
