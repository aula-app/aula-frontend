import Markdown from '@/v2/components/ui/Markdown';
import { twMerge } from 'tailwind-merge';

interface ApprovalNoteProps {
  /** The moderator's argument for turning the idea down. */
  comment: string;
  /** bg/text pair shared with the status chip above it, so the two read as one block. */
  colors: string;
  className?: string;
}

/** The argument behind a rejection, banded between the status chip and the idea it judges. */
const ApprovalNote = ({ comment, colors, className }: ApprovalNoteProps) => (
  <div className={twMerge('ml-4 px-4 py-2 rounded-t-2xl rounded-tr-none', colors, className)}>
    <Markdown className="prose-sm text-inherit">{comment}</Markdown>
  </div>
);

export default ApprovalNote;
