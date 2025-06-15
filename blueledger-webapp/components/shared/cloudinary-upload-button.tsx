'use client';

import React, { useState } from 'react';
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from 'next-cloudinary';
import { Button } from '../ui/button';
import { ImagePlus } from 'lucide-react';
import { toast } from 'sonner';

interface CloudinaryResult {
  event: string;
  info: {
    public_id: string;
    secure_url: string;
  };
}

const CloudinaryUploadButton = () => {
  const uploadPreset =
    process.env.CLOUDINARY_UPLOAD_PRESET ?? 'blueledger-development';

  const onUpload = async (result: CloudinaryUploadWidgetResults) => {
    if (result.event === 'success') {
      const uploadedUrl = result as CloudinaryResult;
      // setPublicId(uploadedUrl.info.public_id);
      toast.success(`Upload successful!: ${uploadedUrl.info.secure_url}`);
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ image: uploadedUrl.info.secure_url }),
      });
      // setPublicId(uploadedUrl.info.public_id);
    }
  };

  return (
    <>
      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary-params"
        uploadPreset={uploadPreset}
        options={{
          sources: ['local'],
          maxFiles: 1,
          maxFileSize: 1024 * 1024 * 5,
          resourceType: 'image',
          multiple: false,
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
        }}
        onSuccess={(result) => {
          onUpload(result);
        }}
        onError={() => {
          toast.error('Upload failed. Please try again.');
        }}
      >
        {({ open }) => {
          return (
            <Button onClick={() => open()}>
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </>
  );
};

export default CloudinaryUploadButton;
