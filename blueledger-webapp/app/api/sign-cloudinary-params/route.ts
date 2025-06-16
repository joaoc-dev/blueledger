import { withAuth } from '@/lib/api/withAuth';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const GET = withAuth(async function GET() {
  const timestamp = Math.floor(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    },
    process.env.CLOUDINARY_API_SECRET as string
  );

  return NextResponse.json({ signature, timestamp });
});
