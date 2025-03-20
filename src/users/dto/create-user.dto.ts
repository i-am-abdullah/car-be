export class CreateUserDto {
  username: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name?: string;
  phone_number?: string;
  profile_picture_url?: string;
  role?: 'user' | 'admin';
  is_verified?: boolean;
}

