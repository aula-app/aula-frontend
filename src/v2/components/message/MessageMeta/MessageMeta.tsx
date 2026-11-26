import Link from '@/v2/components/navigation/Link';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface MessageMetaProps {
  /** Label/value rows. String values that are app paths (e.g. a report's location) become links. */
  entries: [string, ReactNode][];
  className?: string;
}

const MessageMeta = ({ entries, className }: MessageMetaProps) =>
  entries.length > 0 ? (
    <dl className={twMerge('rounded-lg bg-shadow p-3 text-sm flex flex-col gap-1', className)}>
      {entries.map(([label, value]) => (
        <div key={label} className="flex flex-wrap gap-x-1 min-w-0">
          <dt className="font-bold">{label}:</dt>
          <dd className="min-w-0 break-all">
            {typeof value === 'string' && value.startsWith('/') ? (
              <Link to={value} className="underline">
                {value}
              </Link>
            ) : (
              value
            )}
          </dd>
        </div>
      ))}
    </dl>
  ) : null;

export default MessageMeta;
