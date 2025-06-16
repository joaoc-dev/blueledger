export interface UserType {
  id: string;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  bio?: string | null | undefined;
  emailVerified: Date | null;
}
