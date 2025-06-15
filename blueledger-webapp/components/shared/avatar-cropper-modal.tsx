'use client';

import React, { useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  image: string | null;
  open: boolean;
  onClose: () => void;
};

export default function AvatarCropperModal({ image, open, onClose }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = (_: Area, croppedAreaPixels: Area) => {
    console.log('Crop area:', croppedAreaPixels);
  };

  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full h-[400px]">
        <DialogTitle>Crop your profile picture</DialogTitle>

        <div className="relative w-full h-64 rounded-sm overflow-hidden">
          <Cropper
            image={image}
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

        <DialogFooter>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
