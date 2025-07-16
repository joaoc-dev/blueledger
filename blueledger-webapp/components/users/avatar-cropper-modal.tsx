'use client';

import debounce from 'lodash.debounce';
import React, { useEffect, useRef, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import GenericDropzone from '../shared/generic-dropzone';
import { getCroppedImg } from '@/lib/utils/image';
import { Button } from '../ui/button';
import AvatarPreviewPanel from './avatar-preview-panel';
import { toast } from 'sonner';
import { updateUserImage } from '@/services/users/users';
import { useUserStore } from '@/app/(protected)/store';
import { useSession } from 'next-auth/react';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AvatarCropperModal({ open, onClose }: Props) {
  const { update } = useSession();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const setImage = useUserStore((state) => state.setImage);

  const debouncedCrop = useRef(
    debounce(async (imageSrc: string, croppedAreaPixels: Area) => {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(blob);
    }, 100)
  );

  useEffect(() => {
    const debounced = debouncedCrop.current;
    return () => {
      debounced.cancel();
    };
  }, []);

  const handleCropComplete = async (_: Area, croppedAreaPixels: Area) => {
    if (!imageSrc) return;

    debouncedCrop.current(imageSrc, croppedAreaPixels);
  };

  const handleDrop = (files: File[]) => {
    const file = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
  };

  const closeModal = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    onClose();
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
    }
  };

  const handleUpload = async () => {
    if (!croppedImage) return;
    setIsUploading(true);
    try {
      const updatedUser = await updateUserImage(croppedImage);
      await update({
        user: { image: updatedUser.image! },
      });
      setImage(updatedUser.image!);
      closeModal();
      toast.success('Profile picture uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full h-[600px] flex flex-col gap-3">
        {!imageSrc ? (
          <>
            <DialogTitle>Upload your profile picture</DialogTitle>
            <Separator />
            <div className="h-full">
              <GenericDropzone
                onDrop={handleDrop}
                accept={{
                  'image/jpeg': ['.jpg', '.jpeg'],
                  'image/png': ['.png'],
                }}
                maxFileSize={1024 * 1024 * 4}
              />
            </div>
          </>
        ) : (
          <>
            <DialogTitle>Crop your profile picture</DialogTitle>
            <Separator />
            <div className="relative w-full h-full rounded-sm overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
            <Separator />
            <DialogFooter>
              <div className="flex flex-col gap-3 w-full">
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.1}
                  className="w-full"
                  onValueChange={(value) => setZoom(value[0])}
                />
                <div className="flex items-center justify-center gap-12 w-full">
                  {croppedImage && (
                    <AvatarPreviewPanel croppedImage={croppedImage} />
                  )}
                </div>
                <Separator />
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Set new profile picture'}
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
