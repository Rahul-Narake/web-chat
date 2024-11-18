import { z } from 'zod';

export const SignupData = z.object({
  username: z
    .string()
    .min(5, 'username should be min of length 5')
    .regex(/^[a-z][a-z0-9_]{4,15}$/)
    .toLowerCase(),
  name: z.string(),
  password: z
    .string()
    .min(8, 'Password should be minimum of length 8')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    ),
});

export type SignupType = z.infer<typeof SignupData>;

export const GroupChatData = z.object({
  name: z.string().optional(),
  pic: z.string().optional(),
  isGroupChat: z.boolean(),
  users: z.string().array().min(2, "Minimum 2 user's required"),
  admins: z.string().array().min(1),
});

export type GroupChatType = z.infer<typeof GroupChatData>;

export const UsersData = z.object({
  id: z.number(),
  profile: z.string().optional(),
  name: z.string(),
  isFriend: z.boolean(),
  friendRequestSent: z.boolean(),
});

export type UsersType = z.infer<typeof UsersData>;
