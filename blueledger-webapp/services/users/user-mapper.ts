import { UserType } from '@/types/user';
import { UserProfileFormData } from '@/lib/validations/user-schema';

export interface UserApiResponse {
  id: string;
  name: string;
  email: string;
  image: string;
  imagePublicId: string;
  bio: string;
  emailVerified: Date;
}

export interface UserApiRequest {
  name?: string;
  bio?: string;
}

export class UserMapper {
  static toType(apiResponse: UserApiResponse): UserType {
    return {
      ...apiResponse,
    };
  }

  static toApiRequest(data: UserProfileFormData): UserApiRequest {
    return {
      name: data.name ?? undefined,
      bio: data.bio ?? undefined,
    };
  }

  static toTypeList(apiResponses: UserApiResponse[]): UserType[] {
    return apiResponses.map(this.toType);
  }
}
