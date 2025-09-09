'use client';

import Image from 'next/image';
import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useObjectUrl } from '@/hooks/useObjectUrl';

interface AvatarPreviewPanelProps {
  croppedImage?: Blob | null;
}

const AvatarPreviewPanel = memo(({ croppedImage }: AvatarPreviewPanelProps) => {
  const displayUrl = useObjectUrl(croppedImage, { preload: true });

  if (!displayUrl) {
    return (
      <>
        <Skeleton className="rounded-full w-8 h-8" />
        <Skeleton className="rounded-full w-12 h-12" />
        <Skeleton className="rounded-full w-16 h-16" />
        <Skeleton className="rounded-full w-24 h-24" />
      </>
    );
  }

  return (
    <>
      <Image
        key={`${displayUrl}-32`}
        src={displayUrl}
        className="rounded-full"
        alt="Cropped avatar"
        width={32}
        height={32}
        priority
        unoptimized
      />
      <Image
        key={`${displayUrl}-48`}
        src={displayUrl}
        className="rounded-full"
        alt="Cropped avatar"
        width={48}
        height={48}
        priority
        unoptimized
      />
      <Image
        key={`${displayUrl}-64`}
        src={displayUrl}
        className="rounded-full"
        alt="Cropped avatar"
        width={64}
        height={64}
        priority
        unoptimized
      />
      <Image
        key={`${displayUrl}-96`}
        src={displayUrl}
        className="rounded-full"
        alt="Cropped avatar"
        width={96}
        height={96}
        priority
        unoptimized
      />
    </>
  );
});

AvatarPreviewPanel.displayName = 'AvatarPreviewPanel';

export default AvatarPreviewPanel;
