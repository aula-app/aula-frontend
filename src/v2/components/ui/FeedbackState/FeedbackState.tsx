import React from 'react';
import { twMerge } from 'tailwind-merge';

type FeedbackStateProps = {
  image: string;
  alt: string;
  title: string;
  description: string;
  className?: string;
};

const FeedbackState = ({ image, alt, title, description, className }: FeedbackStateProps) => (
  <div className={twMerge('flex-1 flex flex-col items-center justify-center gap-16', className)}>
    <img src={image} alt={alt} loading="lazy" className="w-32" />
    <div className="flex flex-col items-center text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

export default FeedbackState;
