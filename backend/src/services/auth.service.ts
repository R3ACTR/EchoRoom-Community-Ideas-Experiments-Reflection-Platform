// backend/src/services/auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import prisma from "../lib/prisma";
import { User, UserRole } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000;

export interface AuthPayload {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  avatar?: string | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateAccessToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const generateRefreshToken = async (userId: string): Promise<string> => {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN);

  await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });

  return token;
};

export const verifyRefreshToken = async (
  token: string
): Promise<string | null> => {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: { token },
  });

  if (!refreshToken) return null;

  if (refreshToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: refreshToken.id } });
    return null;
  }

  return refreshToken.userId;
};

export const generateTokenPair = async (user: User): Promise<TokenPair> => {
  const payload: AuthPayload = {
  userId: user.id,
  email: user.email,
  username: user.username,
  role: user.role,
  avatar: user.avatar || null,
};

  const accessToken = generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(user.id);

  return { accessToken, refreshToken };
};

export const registerUser = async (
  email: string,
  username: string,
  password: string,

) => {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existingUser) {
    throw new Error("User with this email or username already exists");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      provider: "LOCAL",
      role: "MEMBER",
    },
  });

  const tokens = await generateTokenPair(user);

  return { user, tokens };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Prevent Google accounts from using password login
  if (!user.passwordHash || user.provider !== "LOCAL") {
    throw new Error("This account uses Google login. Please sign in with Google.");
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  const tokens = await generateTokenPair(user);

  return { user, tokens };
};

/**
 * GOOGLE LOGIN SERVICE
 */
export const loginWithGoogle = async (
  email: string,
  firstName: string,
  lastName: string,
  avatar?: string
) => {
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Auto-generate username from email prefix
    const baseUsername = email.split("@")[0];
    let username = baseUsername;
    let counter = 1;

    // Ensure username uniqueness
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    user = await prisma.user.create({
      data: {
        email,
        username,
        provider: "GOOGLE",
        avatar: avatar && avatar.trim() !== "" ? avatar : null,
        role: "MEMBER",
      },
    });
  }

  const tokens = await generateTokenPair(user);

  return { user, tokens };
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<TokenPair> => {
  const userId = await verifyRefreshToken(refreshToken);

  if (!userId) {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });

  return generateTokenPair(user);
};

export const logoutUser = async (refreshToken: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
};

export const getUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

export const getUserByEmail = async (
  email: string
): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

export const verifyAccessToken = (
  token: string
): AuthPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
};