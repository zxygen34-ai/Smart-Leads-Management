import { ApiError } from '../middleware/errorHandler';
import { User, UserDocument, UserRole } from '../models/User';
import { signToken } from '../utils/jwt';
import { comparePassword, hashPassword } from '../utils/password';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthResult = {
  token: string;
  user: UserResponse;
};

function toUserResponse(user: UserDocument): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const email = input.email.toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    throw new ApiError('Email already in use', 409, 'EMAIL_IN_USE');
  }

  const passwordHash = await hashPassword(input.password);
  const user = await User.create({
    name: input.name,
    email,
    passwordHash,
    role: 'sales'
  });

  const token = signToken({ sub: user.id, role: user.role });

  return { token, user: toUserResponse(user) };
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const isValid = await comparePassword(password, user.passwordHash);

  if (!isValid) {
    throw new ApiError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const token = signToken({ sub: user.id, role: user.role });

  return { token, user: toUserResponse(user) };
}

export async function seedAdminUser(input: RegisterInput): Promise<AuthResult> {
  const adminExists = await User.exists({ role: 'admin' });

  if (adminExists) {
    throw new ApiError('Admin already exists', 409, 'ADMIN_EXISTS');
  }

  const passwordHash = await hashPassword(input.password);
  const user = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash,
    role: 'admin'
  });

  const token = signToken({ sub: user.id, role: user.role });

  return { token, user: toUserResponse(user) };
}
