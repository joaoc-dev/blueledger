import Image from 'next/image';

const AvatarPreview = ({
  croppedImage,
  size,
}: {
  croppedImage: Blob;
  size: number;
}) => {
  return (
    <Image
      src={URL.createObjectURL(croppedImage)}
      alt="Cropped avatar"
      className="rounded-full"
      width={size}
      height={size}
    />
  );
};

type Props = {
  croppedImage: Blob;
};

const AvatarPreviewPanel = ({ croppedImage }: Props) => {
  return (
    <>
      <AvatarPreview croppedImage={croppedImage} size={32} />
      <AvatarPreview croppedImage={croppedImage} size={48} />
      <AvatarPreview croppedImage={croppedImage} size={64} />
      <AvatarPreview croppedImage={croppedImage} size={96} />
    </>
  );
};

export default AvatarPreviewPanel;
