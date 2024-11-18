import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { Request, Response } from 'express';
import prisma from '@repo/db/client';
import { SignupType, SignupData, UsersType } from '@repo/common/SignupData';
import { ApiResponse } from '../utils/ApiResponse';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken';

const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hash(password, salt);
  return hashedPassword;
};

export const signup = asyncHandler(async (req: Request, res: Response) => {
  try {
    const reqBody: SignupType = await req.body;
    const result = SignupData.safeParse(reqBody);
    if (!result.success) {
      return res.status(400).json(new ApiError(400, 'Please enter valid data'));
    }

    const user = await prisma.user.findUnique({
      where: { username: reqBody.username },
    });
    if (user) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, 'username already exist!'));
    }

    const password = await encryptPassword(reqBody.password);
    const newUser = await prisma.user.create({
      data: { name: reqBody.name, username: reqBody.username, password },
    });

    const token = generateToken(newUser?.id, res);
    return res
      .status(201)
      .json(new ApiResponse(201, { token }, 'Signup successfull!'));
  } catch (error: any) {
    console.log(`error :: ${error?.message}`);
    throw new ApiError(500, 'Error while signup, try again later');
  }
});

export const signIn = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { username, password } = await req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json(new ApiError(400, 'username and password required'));
    }
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res
        .status(403)
        .json(new ApiError(403, 'Invalid username or password'));
    }
    const isValid = await bcrypt.compare(password, user?.password);
    if (!isValid) {
      return res
        .status(403)
        .json(new ApiResponse(403, {}, 'Invalid username or password'));
    }
    const token = generateToken(user?.id, res);
    return res
      .status(200)
      .json(new ApiResponse(200, { token }, 'Signin successfull'));
  } catch (error: any) {
    console.log(`error :: ${error?.message}`);
    throw new ApiError(500, 'Error while signing, try again later');
  }
});

export const signout = asyncHandler(async (req: Request, res: Response) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Loggedout successfully'));
  } catch (error) {
    throw new ApiError(500, 'Error while signing out');
  }
});

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const id = req.user.id;
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          name: true,
          id: true,
          profile: true,
          username: true,
          friendRequestsSent: {
            where: {
              status: 'PENDING',
            },
            select: {
              id: true,
              receiverId: true,
              receiver: {
                select: {
                  name: true,
                  id: true,
                  profile: true,
                },
              },
            },
          },
          friendRequestsReceived: {
            where: {
              status: 'PENDING',
            },
            select: {
              id: true,
              senderId: true,
              sender: {
                select: {
                  name: true,
                  id: true,
                  profile: true,
                },
              },
            },
          },
          friends: {
            select: {
              id: true,
              name: true,
              profile: true,
            },
          },
          messages: {
            select: {
              id: true,
              conversationId: true,
              senderId: true,
              body: true,
              createdAt: true,
              Sender: {
                select: {
                  id: true,
                  name: true,
                  profile: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new ApiError(403, 'Invalid request or Unauthorised');
      }
      return res
        .status(200)
        .json(new ApiResponse(200, user, 'Current user fetched successfully'));
    } catch (error: any) {
      console.log(
        `Error while fetching current user deatils:: ${error?.message}`
      );
      throw new ApiError(500, 'Error while getting current user');
    }
  }
);

export const addFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const senderId = req.user.id;
      const { receiverId } = await req.body;
      if (!senderId || !receiverId) {
        return res.status(400).json(new ApiError(400, 'Invalid request'));
      }
      const users = [{ id: senderId }, { id: Number(receiverId) }];

      const existingRequest = await prisma.friendRequest.findFirst({
        where: {
          userIds: { hasEvery: [senderId, Number(receiverId)] },
        },
      });

      if (existingRequest) {
        if (existingRequest?.status === 'PENDING') {
          return res
            .status(400)
            .json(
              new ApiError(
                400,
                'Friend request already exists, please check received friend requests'
              )
            );
        } else {
          const result = await prisma.$transaction(
            async (prisma) => {
              const request = await prisma.friendRequest.update({
                where: { id: existingRequest?.id },
                data: {
                  sender: { connect: { id: senderId } },
                  receiver: { connect: { id: Number(receiverId) } },
                  status: 'PENDING',
                },
                select: {
                  id: true,
                  receiver: {
                    select: {
                      id: true,
                      name: true,
                      username: true,
                      profile: true,
                    },
                  },
                  receiverId: true,
                },
              });
              await prisma.user.update({
                where: { id: senderId },
                data: {
                  friendRequestsSent: { connect: { id: request?.id } },
                  friendRequests: { connect: { id: request?.id } },
                },
              });
              await prisma.user.update({
                where: { id: Number(receiverId) },
                data: {
                  friendRequestsReceived: { connect: { id: request?.id } },
                  friendRequests: { connect: { id: request?.id } },
                },
              });
              return request;
            },
            {
              maxWait: 5000, // 5 seconds max wait to connect to prisma
              timeout: 20000, // 20 seconds
            }
          );
          return res.status(200).json(
            new ApiResponse(
              200,
              {
                friendRequest: {
                  id: result?.id,
                  receiverId: result.receiverId,
                  receiver: result.receiver,
                },
                userId: Number(receiverId),
              },
              'Friend request send successfully'
            )
          );
        }
      } else {
        const result = await prisma.$transaction(
          async (prisma) => {
            const friendRequest = await prisma.friendRequest.create({
              data: {
                sender: { connect: { id: senderId } },
                receiver: { connect: { id: Number(receiverId) } },
                users: { connect: users },
                userIds: { set: [senderId, Number(receiverId)] },
                status: 'PENDING',
              },
              select: {
                id: true,
                receiver: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    profile: true,
                  },
                },
                receiverId: true,
              },
            });

            await prisma.user.update({
              where: { id: senderId },
              data: {
                friendRequestsSent: {
                  connect: { id: friendRequest?.id },
                },
                friendRequests: { connect: { id: friendRequest?.id } },
              },
            });
            await prisma.user.update({
              where: { id: Number(receiverId) },
              data: {
                friendRequestsReceived: {
                  connect: { id: friendRequest?.id },
                },
                friendRequests: { connect: { id: friendRequest?.id } },
              },
            });

            return friendRequest;
          },
          {
            maxWait: 5000, // 5 seconds max wait to connect to prisma
            timeout: 20000, // 20 seconds
          }
        );

        return res.status(201).json(
          new ApiResponse(
            201,
            {
              friendRequest: {
                id: result?.id,
                receiverId: result.receiverId,
                receiver: result.receiver,
              },
              userId: Number(receiverId),
            },
            'Friend request sent successfully'
          )
        );
      }
    } catch (error: any) {
      console.log(`error :: ${error?.message}`);
      throw new ApiError(500, 'Error while adding friend');
    }
  }
);

export const acceptFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const receiverId = req.user.id;
      const { userId } = await req.body;

      if (!receiverId || !userId) {
        return res
          .status(400)
          .json(new ApiResponse(404, 'Invalid request or Unauthorised'));
      }

      const request = await prisma.friendRequest.findFirst({
        where: {
          userIds: { hasEvery: [receiverId, Number(userId)] },
          status: 'PENDING',
        },
      });

      if (!request) {
        return res
          .status(404)
          .json(new ApiError(404, 'Friend request not found or unauthorized'));
      }

      const result = await prisma.$transaction(
        async (prisma) => {
          const updatedRequest = await prisma.friendRequest.update({
            where: { id: request.id },
            data: {
              status: 'ACCEPTED',
            },
            select: {
              id: true,
              sender: true,
              receiver: true,
              senderId: true,
              receiverId: true,
            },
          });

          await prisma.user.update({
            where: { id: receiverId },
            data: {
              friends: {
                connect: { id: request.senderId },
              },
              friendRequestsReceived: { connect: { id: request?.id } },
              friendRequests: { connect: { id: request?.id } },
            },
          });

          await prisma.user.update({
            where: { id: request.senderId },
            data: {
              friends: {
                connect: { id: receiverId },
              },
              friendRequestsSent: { connect: { id: request?.id } },
              friendRequests: { connect: { id: request?.id } },
            },
          });

          return updatedRequest;
        },
        {
          maxWait: 5000, // 5 seconds max wait to connect to prisma
          timeout: 20000, // 20 seconds
        }
      );

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            friendRequest: {
              id: result?.id,
              senderId: result.senderId,
              sender: result.sender,
            },
          },
          'Friend request accepted successfully'
        )
      );
    } catch (error: any) {
      console.log(`error :: ${error?.message}`);
      throw new ApiError(500, 'Error while accepting add friend');
    }
  }
);

export const rejectFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const senderId = req.user.id;
      const { userId } = await req.body;
      if (!senderId || !userId) {
        return res.status(400).json(new ApiResponse(400, 'Invalid request'));
      }
      const request = await prisma.friendRequest.findFirst({
        where: {
          userIds: { hasEvery: [senderId, Number(userId)] },
          status: 'PENDING',
        },
      });
      if (!request) {
        return res.status(400).json(new ApiError(400, 'Invalid request'));
      }

      const result = await prisma.$transaction(
        async (prisma) => {
          const result = await prisma.friendRequest.update({
            where: { id: request?.id },
            data: {
              status: 'REJECTED',
            },
            select: {
              id: true,
              sender: {
                select: { id: true, name: true, username: true, profile: true },
              },
              senderId: true,
            },
          });
          await prisma.user.update({
            where: { id: request?.receiverId },
            data: {
              friendRequestsReceived: {
                connect: { id: result.id },
              },
              friendRequests: { connect: { id: result.id } },
            },
          });
          await prisma.user.update({
            where: { id: request?.senderId },
            data: {
              friendRequestsSent: {
                connect: { id: result.id },
              },
              friendRequests: { connect: { id: result.id } },
            },
          });

          return result;
        },
        {
          maxWait: 5000, // 5 seconds max wait to connect to prisma
          timeout: 20000, // 20 seconds
        }
      );

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { friendRequest: result, senderId: result.senderId },
            'Friend request REJECTED successfully'
          )
        );
    } catch (error: any) {
      console.log(`error :: ${error?.message}`);
      throw new ApiError(500, 'Error while rejecting friend request');
    }
  }
);

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user.id;
    const me = await prisma.user.findUnique({
      where: { id: loggedInUser },
      select: { friends: true, friendRequestsSent: true },
    });
    const users = await prisma.user.findMany({
      where: { id: { not: loggedInUser } },
      select: {
        id: true,
        name: true,
        profile: true,
      },
    });

    const myFriends = me?.friends.map((f) => f.id);
    const mySentFriendRequests = me?.friendRequestsSent.map(
      (f) => f.receiverId
    );

    const result = users.map((u) => {
      let i: UsersType = {
        ...u,
        isFriend: false,
        friendRequestSent: false,
        profile: u.profile ? u.profile : undefined,
      };
      if (myFriends?.includes(u.id)) {
        i = {
          ...u,
          isFriend: true,
          friendRequestSent: true,
          profile: u.profile ? u.profile : undefined,
        };
      }

      if (mySentFriendRequests?.includes(u.id)) {
        i = { ...i, friendRequestSent: true };
      }
      return i;
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { users: result }, 'users fetched successfully')
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'Internal server error');
  }
});

export const cancelFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { userId } = await req.body;
      const senderId = req.user.id;
      if (!userId || !senderId) {
        return res.status(400).json(new ApiError(400, 'Invalid request'));
      }

      const friendRequest = await prisma.friendRequest.findFirst({
        where: {
          userIds: { hasEvery: [senderId, Number(userId)] },
          status: { in: ['PENDING', 'REJECTED'] },
        },
        select: {
          id: true,
          receiver: {
            select: {
              id: true,
              name: true,
              profile: true,
              username: true,
            },
          },
          receiverId: true,
        },
      });

      if (!friendRequest) {
        return res
          .status(400)
          .json(new ApiError(400, 'Friend request not found with given users'));
      }

      const result = await prisma.$transaction(
        async (prisma) => {
          const result = await prisma.friendRequest.update({
            where: { id: friendRequest?.id },
            data: { status: 'REJECTED' },
          });

          await prisma.user.update({
            where: { id: result.senderId },
            data: {
              friendRequestsSent: {
                connect: { id: friendRequest?.id },
              },
              friendRequests: { connect: { id: friendRequest?.id } },
            },
          });
          await prisma.user.update({
            where: { id: result.receiverId },
            data: {
              friendRequestsReceived: {
                connect: { id: friendRequest?.id },
              },
              friendRequests: { connect: { id: friendRequest?.id } },
            },
          });

          return result;
        },
        {
          maxWait: 5000, // 5 seconds max wait to connect to prisma
          timeout: 20000, // 20 seconds
        }
      );
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { userId, friendRequest },
            'Friend request cancelled successfully'
          )
        );
    } catch (error) {
      console.log(error);
      throw new ApiError(500, 'Internal server error');
    }
  }
);

export const removeFriend = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const senderId = req.user.id;
      const { userId } = await req.body;

      const friendRequest = await prisma.friendRequest.findFirst({
        where: {
          userIds: { hasEvery: [senderId, Number(userId)] },
          status: 'ACCEPTED',
        },
      });
      if (!friendRequest) {
        return res
          .status(400)
          .json(new ApiError(400, 'Friend request not found with given users'));
      }
      const result = await prisma.$transaction(
        async (prisma) => {
          const result = await prisma.friendRequest.update({
            where: { id: friendRequest?.id },
            data: { status: 'REJECTED' },
            select: {
              id: true,
              sender: {
                select: { id: true, name: true, username: true, profile: true },
              },
              senderId: true,
              receiver: {
                select: { id: true, name: true, username: true, profile: true },
              },
              receiverId: true,
            },
          });
          await prisma.user.update({
            where: { id: senderId },
            data: { friends: { disconnect: { id: Number(userId) } } },
          });
          await prisma.user.update({
            where: { id: Number(userId) },
            data: { friends: { disconnect: { id: senderId } } },
          });
          return result;
        },
        {
          maxWait: 5000, // 5 seconds max wait to connect to prisma
          timeout: 20000, // 20 seconds
        }
      );
      const request =
        result.senderId === senderId
          ? {
              id: result?.id,
              receivr: result?.receiver,
              receiverId: result?.receiverId,
            }
          : {
              id: result?.id,
              sender: result?.sender,
              senderId: result?.senderId,
            };
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { userId, friendRequest: request },
            'Friend removed successfully'
          )
        );
    } catch (error) {
      console.log(error);
      throw new ApiError(500, 'Internal server error');
    }
  }
);
