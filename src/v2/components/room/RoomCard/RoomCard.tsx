import DefaultImage from '@/components/DefaultImages';
import { TEST_IDS } from '@/test-ids';
import { RoomType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import Link from '@/v2/components/navigation/Link';
import PhaseBar from '@/v2/components/ui/PhaseBar';

interface RoomCardProps {
  room: RoomType;
  /** Item count per phase, shown in the card's phase bar. Omitted while they load. */
  counts?: Partial<Record<`${RoomPhases}`, number>>;
}

// A room's cover image is stored in description_internal as "DI:<image>:<shift>".
const parseImage = (description: string) => {
  if (!description?.startsWith('DI:')) return { image: 0, shift: 0 };

  const [, image = '0', shift = '0'] = description.split(':');
  return { image: Number(image) || 0, shift: Number(shift) || 0 };
};

const RoomCard = ({ room, counts }: RoomCardProps) => {
  const { image, shift } = parseImage(room.description_internal);
  const name = room.room_name || 'AULA';

  return (
    <div
      data-testid={TEST_IDS.ROOM_CARD}
      className="flex flex-col overflow-hidden rounded-2xl border border-secondary bg-background focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-foreground [&_a:focus-visible]:outline-none"
    >
      <Link
        to={`/room/${room.hash_id}/phase/0`}
        className="flex flex-1 flex-col gap-2 p-4 no-underline hover:no-underline"
      >
        <h2 className="truncate font-bold" title={name}>
          {name}
        </h2>
        <DefaultImage image={image} shift={shift} />
      </Link>
      <PhaseBar room={room.hash_id} counts={counts} roomName={name} />
    </div>
  );
};

export default RoomCard;
