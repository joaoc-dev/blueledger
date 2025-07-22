'use client';

import Image from 'next/image';
import { memo, useEffect, useMemo } from 'react';

const AvatarPreview = memo(
  ({ imageUrl, size }: { imageUrl: string; size: number }) => {
    return (
      <Image
        src={imageUrl}
        alt="Cropped avatar"
        className="rounded-full"
        width={size}
        height={size}
      />
    );
  }
);

AvatarPreview.displayName = 'AvatarPreview';

type Props = {
  croppedImage: Blob;
};

const AvatarPreviewPanel = memo(({ croppedImage }: Props) => {
  const croppedImageUrl = useMemo(
    () => URL.createObjectURL(croppedImage),
    [croppedImage]
  );

  useEffect(() => {
    return () => URL.revokeObjectURL(croppedImageUrl); // Cleanup memory
  }, [croppedImageUrl]);

  console.log('AvatarPreviewPanel rendered');

  return (
    <>
      <AvatarPreview imageUrl={croppedImageUrl} size={32} />
      <AvatarPreview imageUrl={croppedImageUrl} size={48} />
      <AvatarPreview imageUrl={croppedImageUrl} size={64} />
      <AvatarPreview imageUrl={croppedImageUrl} size={96} />
    </>
  );
});

AvatarPreviewPanel.displayName = 'AvatarPreviewPanel';

export default AvatarPreviewPanel;
