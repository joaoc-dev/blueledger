import { http, HttpResponse } from 'msw';
import { db } from '../db';

// Mock authenticated user ID for testing
// In a real scenario, this would come from the auth context
let mockAuthenticatedUserId: string | null = null;

export function setMockAuthenticatedUser(userId: string | null) {
  mockAuthenticatedUserId = userId;
}

const getUserHandler = http.get('/api/users/me', () => {
  if (!mockAuthenticatedUserId) {
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = db.user.findFirst({
    where: { id: { equals: mockAuthenticatedUserId } },
  });

  if (!user) {
    return HttpResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return HttpResponse.json(user);
});

const updateUserHandler = http.patch('/api/users/me', async ({ request }) => {
  if (!mockAuthenticatedUserId) {
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as any;
  const updated = db.user.update({
    where: { id: { equals: mockAuthenticatedUserId } },
    data: body,
  });

  if (!updated) {
    return HttpResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return HttpResponse.json(updated);
});

const uploadUserImageHandler = http.post('/api/users/image', async ({ request }) => {
  if (!mockAuthenticatedUserId) {
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const image = formData.get('image') as Blob | null;

  const user = db.user.findFirst({
    where: { id: { equals: mockAuthenticatedUserId } },
  });

  if (!user) {
    return HttpResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Check if this is actually an image removal (empty blob)
  const isImageRemoval = !image || image.size === 0;

  // Simulate image upload behavior - update user with new image data
  if (!isImageRemoval) {
    // Simulate successful image upload
    const updated = db.user.update({
      where: { id: { equals: mockAuthenticatedUserId } },
      data: {
        image: 'https://example.com/uploaded-avatar.jpg',
        imagePublicId: `avatar-${Date.now()}`,
      },
    });
    return HttpResponse.json(updated);
  }
  else {
    // Simulate image removal - match real route behavior
    const updated = db.user.update({
      where: { id: { equals: mockAuthenticatedUserId } },
      data: {
        image: '',
        imagePublicId: '',
      },
    });

    return HttpResponse.json(updated);
  }
});

const customUserHandlers = [
  getUserHandler,
  updateUserHandler,
  uploadUserImageHandler,
];

export const userHandlers = customUserHandlers;
