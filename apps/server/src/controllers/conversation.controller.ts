import { GroupChatData, GroupChatType } from '@repo/common/SignupData';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import prisma from '@repo/db/client';
import { SubscriptionManager } from '../SubscriptionManager';
import uploadOnCloudinary from '../utils/cloudinary';
export const createNewGroupChat = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const id = req.user.id;
      const reqBody: GroupChatType = await req.body;
      const result: any = GroupChatData.safeParse(reqBody);
      if (!result.success) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              `Please enter valid data :: ${result?.error?.message}`
            )
          );
      }
      const usersToAdd = reqBody.users.map((userId: string) => ({
        id: Number(userId),
      }));

      const chat = await prisma.conversation.create({
        data: {
          name: reqBody?.name,
          pic: reqBody?.pic,
          isGroupChat: true,
          users: { connect: usersToAdd },
          admins: { connect: { id } },
        },
        select: {
          users: {
            select: {
              id: true,
              name: true,
              profile: true,
              username: true,
            },
          },
          admins: {
            select: {
              id: true,
              name: true,
              profile: true,
              username: true,
            },
          },
          id: true,
          name: true,
          pic: true,
          createdAt: true,
          updatedAt: true,
          messages: {
            select: {
              id: true,
              body: true,
              senderId: true,
              conversationId: true,
              createdAt: true,
              Sender: true,
            },
          },
        },
      });

      return res
        .status(201)
        .json(new ApiResponse(201, chat, 'Group chat created successfully'));
    } catch (error: any) {
      console.log(`Error while creating new group chat ::${error?.message}`);
      throw new ApiError(500, 'Internal server error');
    }
  }
);

export const createNewGroupChatWithPic = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const id = req.user.id;
      const { name, isGroupChat, users, admins } = await req.body;
      const reqBody = {
        name,
        isGroupChat: Boolean(isGroupChat),
        users: JSON.parse(users),
        admins: JSON.parse(admins),
      };

      const result: any = GroupChatData.safeParse(reqBody);
      if (!result.success) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              `Please enter valid data :: ${result?.error?.message}`
            )
          );
      }
      const usersToAdd = reqBody.users.map((userId: string) => ({
        id: Number(userId),
      }));

      const profilePath = req.file?.path;
      const url = await uploadOnCloudinary(profilePath!);

      const chat = await prisma.conversation.create({
        data: {
          name: reqBody?.name,
          pic: url,
          isGroupChat: true,
          users: { connect: usersToAdd },
          admins: { connect: { id } },
        },
        select: {
          users: {
            select: {
              id: true,
              name: true,
              profile: true,
              username: true,
            },
          },
          admins: {
            select: {
              id: true,
              name: true,
              profile: true,
              username: true,
            },
          },
          id: true,
          name: true,
          pic: true,
          createdAt: true,
          updatedAt: true,
          messages: {
            select: {
              id: true,
              body: true,
              senderId: true,
              conversationId: true,
              createdAt: true,
              Sender: true,
            },
          },
        },
      });

      return res
        .status(201)
        .json(new ApiResponse(201, chat, 'Group chat created successfully'));
    } catch (error: any) {
      console.log(`Error while creating new group chat ::${error?.message}`);
      throw new ApiError(500, 'Internal server error');
    }
  }
);

export const createNormalChat = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const admin = req.user.id;
      const { receiverId } = await req.body;
      if (!receiverId || !admin) {
        return new ApiError(400, 'Invalid request');
      }
      const chatExist = await prisma.conversation.findFirst({
        where: {
          isGroupChat: false,
          users: { every: { id: { in: [admin, Number(receiverId)] } } },
        },
        select: {
          users: {
            select: {
              id: true,
              name: true,
              profile: true,
              username: true,
            },
          },
          admins: {
            select: {
              id: true,
              name: true,
              profile: true,
              username: true,
            },
          },
          id: true,
          name: true,
          pic: true,
          createdAt: true,
          updatedAt: true,
          messages: {
            select: {
              id: true,
              body: true,
              senderId: true,
              conversationId: true,
              createdAt: true,
              Sender: true,
            },
          },
        },
      });

      if (chatExist) {
        return res
          .status(200)
          .json(new ApiResponse(200, chatExist, 'Chat is already exist'));
      }
      const usersToAdd = [{ id: admin }, { id: Number(receiverId) }];
      const chat = await prisma.conversation.create({
        data: {
          isGroupChat: false,
          users: { connect: usersToAdd },
          admins: { connect: usersToAdd },
        },
        select: {
          users: {
            select: {
              id: true,
              name: true,
              profile: true,
              username: true,
            },
          },
          admins: {
            select: {
              id: true,
              name: true,
              profile: true,
              username: true,
            },
          },
          id: true,
          name: true,
          pic: true,
          createdAt: true,
          updatedAt: true,
          messages: {
            select: {
              id: true,
              body: true,
              senderId: true,
              conversationId: true,
              createdAt: true,
              Sender: true,
            },
          },
        },
      });
      return res
        .status(201)
        .json(new ApiResponse(201, chat, 'New Normal chat created'));
    } catch (error: any) {
      console.log(`Error while creating normal chat ::${error?.message}`);
      throw new ApiError(500, 'Internal server error');
    }
  }
);

export const getAllConversations = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res
          .status(400)
          .json(new ApiResponse(400, 'Invalid request: User ID is required'));
      }

      const conversations = await prisma.conversation.findMany({
        where: {
          users: {
            some: {
              id: userId,
            },
          },
        },

        include: {
          users: {
            select: {
              id: true,
              name: true,
              username: true,
              profile: true,
            },
          },
          admins: {
            select: {
              id: true,
              name: true,
              username: true,
              profile: true,
            },
          },
          messages: {
            select: {
              id: true,
              body: true,
              createdAt: true,
              Sender: {
                select: {
                  id: true,
                  name: true,
                  profile: true,
                },
              },
              conversationId: true,
              senderId: true,
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      return res.status(200).json(
        new ApiResponse(
          200,
          conversations.map((c) => {
            if (c.name === null && !c.isGroupChat) {
              const r = c.users.find((u) => u.id !== userId);
              return { ...c, name: r?.name };
            } else {
              return c;
            }
          }),
          'User conversations fetched successfully'
        )
      );
    } catch (error: any) {
      console.log(`Error in getting conversations :: ${error?.message}`);
      throw new ApiError(500, 'Internal server error');
    }
  }
);

export const getConversation = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { conversationId } = await req.body;
      const conversation = await prisma.conversation.findUnique({
        where: { id: Number(conversationId) },
        select: {
          id: true,
          messages: true,
          users: true,
        },
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            conversation,
            'Conversation fetched successfully'
          )
        );
    } catch (error: any) {
      console.log(`Error while fetching conversation::${error?.message}`);
      throw new ApiError(500, 'Internal server error');
    }
  }
);

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  try {
    const senderId = req.user.id;
    const { body, conversationId } = await req.body;
    if (!body || !conversationId || !senderId) {
      return res.status(400).json(new ApiError(400, 'Invalid request'));
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: Number(conversationId), users: { some: { id: senderId } } },
    });

    if (!conversation) {
      return res
        .status(403)
        .json(new ApiError(403, 'User is not part of any conversation'));
    }

    const newMessage = await prisma.message.create({
      data: {
        body,
        Conversation: { connect: { id: conversation?.id } },
        Sender: { connect: { id: senderId } },
      },
      select: {
        id: true,
        body: true,
        createdAt: true,
        Sender: {
          select: {
            id: true,
            name: true,
            username: true,
            profile: true,
          },
        },
        Conversation: {
          select: {
            id: true,
            name: true,
          },
        },
        senderId: true,
        conversationId: true,
      },
    });

    console.log('sending message');
    SubscriptionManager.getInstance().sendMessage(
      String(newMessage.conversationId),
      JSON.stringify(newMessage)
    );
    console.log('message sent');

    return res
      .status(201)
      .json(new ApiResponse(201, newMessage, 'Message sent successfully'));
  } catch (error: any) {
    console.log(`Error while sending message :: ${error?.message}`);
    throw new ApiError(500, 'Error while sending message');
  }
});

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  try {
    const conversationId = req.params.conversationId;
    if (!conversationId) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, {}, 'ConversationId required to get messages')
        );
    }
    const messages = await prisma.message.findMany({
      where: { conversationId: Number(conversationId) },
      select: {
        id: true,
        body: true,
        createdAt: true,
        Sender: {
          select: {
            id: true,
            name: true,
            profile: true,
          },
        },
        conversationId: true,
        senderId: true,
      },
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, messages, 'All messages fetched successfully')
      );
  } catch (error: any) {
    console.log(error.message);
    throw new ApiError(500, 'Internal server error');
  }
});

export const addNewMemebersToGroup = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        users,
        conversationId,
      }: { users: number[]; conversationId: number } = await req.body;
      const admin = req.user.id;
      if (!users || users.length === 0 || !conversationId) {
        return res.status(400).json(new ApiError(400, 'Invalid data'));
      }
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          admins: { select: { id: true } },
          users: { select: { id: true } },
        },
      });
      if (!conversation || !conversation?.isGroupChat) {
        return res.status(400).json(new ApiError(400, 'Invalid conversation'));
      }

      const admins = conversation.admins.map((a) => a.id);
      const members = conversation.users.map((u) => {
        return {
          id: u?.id,
        };
      });
      if (!admins.includes(admin)) {
        return res.status(403).json(new ApiError(403, 'Unauthorized access'));
      }

      users.map((u) => {
        members.push({ id: u });
      });

      const updatedConversation = await prisma.conversation.update({
        where: { id: conversationId },
        data: { users: { connect: members } },
        select: {
          users: {
            select: {
              id: true,
              name: true,
              profile: true,
              username: true,
            },
          },
        },
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { members: updatedConversation?.users, conversationId },
            'New members added successfully!'
          )
        );
    } catch (error: any) {
      console.log(error);
      return res.status(500).json(new ApiError(500, error?.message));
    }
  }
);

export const updateConversationProfile = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const path = req.file?.path;
      const { conversationId } = await req.body;
      if (!conversationId || !path) {
        return res.status(400).json(new ApiResponse(400, 'Invalid data'));
      }
      const conversation = await prisma.conversation.findUnique({
        where: { id: Number(conversationId) },
      });

      if (!conversation) {
        return res.status(400).json(new ApiError(400, 'Invalid conversation'));
      }
      const url = await uploadOnCloudinary(path!);
      const updatedConversation = await prisma.conversation.update({
        where: { id: conversation?.id },
        data: { pic: url },
        select: {
          users: {
            select: {
              id: true,
              name: true,
              profile: true,
              username: true,
            },
          },
          admins: {
            select: {
              id: true,
              name: true,
              profile: true,
              username: true,
            },
          },
          id: true,
          name: true,
          pic: true,
          createdAt: true,
          updatedAt: true,
          messages: {
            select: {
              id: true,
              body: true,
              senderId: true,
              conversationId: true,
              createdAt: true,
              Sender: true,
            },
          },
          isGroupChat: true,
        },
      });

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { conversation: updatedConversation },
            'Profile picture updated successfully'
          )
        );
    } catch (error) {
      console.log(error);
      return res.status(500).json(new ApiError(500, 'Something went wrong'));
    }
  }
);

export const updateConversationName = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { conversationId, name } = await req.body;
      if (!name || !conversationId) {
        return res.status(400).json(new ApiError(400, 'Invalid data'));
      }
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });
      if (!conversation) {
        return res.status(400).json(new ApiError(400, 'Invalid conversation'));
      }
      const updatedConversation = await prisma.conversation.update({
        where: { id: conversation?.id },
        data: { name },
        select: {
          users: {
            select: {
              id: true,
              name: true,
              profile: true,
              username: true,
            },
          },
          admins: {
            select: {
              id: true,
              name: true,
              profile: true,
              username: true,
            },
          },
          id: true,
          name: true,
          pic: true,
          createdAt: true,
          updatedAt: true,
          messages: {
            select: {
              id: true,
              body: true,
              senderId: true,
              conversationId: true,
              createdAt: true,
              Sender: true,
            },
          },
          isGroupChat: true,
        },
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { conversation: updatedConversation },
            'Conversation name updated successfully'
          )
        );
    } catch (error) {
      console.log(error);
      return res.status(500).json(new ApiResponse(500, 'Something went wrong'));
    }
  }
);
