import mongoose from 'mongoose';
import { Roles } from '../enums/role.enum';
import AccountModel from '../models/account.model';
import MemberModel from '../models/member.model';
import RoleModel from '../models/roles-permission.model';
import UserModel, { UserDocument } from '../models/user.model';
import WorkspaceModel from '../models/workspace.model';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '../utils/appError';
import { ProviderEnum } from '../enums/account-provider.enum';

export const loginOrCreateAccountService = async (data: {
  provider: string; // Authentication provider (e.g., Google, Facebook)
  displayName: string; // User's display name
  providerId: string; // Unique ID from the provider
  picture?: string; // Optional profile picture URL
  email?: string; // Optional email address
}) => {
  const { provider, displayName, providerId, picture, email } = data; // Destructure input data

  try {
    let user = await UserModel.findOne({ email });

    if (!user) {
      // If user does not exist, create a new user
      user = await UserModel.create({
        email, // Set the user's email
        name: displayName, // Set the user's display name
        profilePicture: picture || null, // Set the profile picture or null if not provided
      });

      const account = await AccountModel.create({
        userId: user._id, // Link the account to the newly created user
        provider, // Set the provider
        providerId, // Set the provider ID
      });

      const workspace = await WorkspaceModel.create({
        name: 'My Workspace', // Default workspace name
        description: `Workspace created for ${user.name}`, // Description for the workspace
        owner: user._id, // Set the user as the owner of the workspace
      });

      const ownerRole = await RoleModel.findOne({ name: Roles.OWNER });
      if (!ownerRole) {
        throw new Error('Owner role not found'); // Throw an error if the owner role is not found
      }

      await MemberModel.create({
        userId: user._id, // Link the member to the user
        workspaceId: workspace._id as unknown as mongoose.Types.ObjectId, // Link the member to the workspace
        role: ownerRole._id, // Assign the owner role to the member
        joinedAt: new Date(), // Set the join date to the current date
      });

      await UserModel.findByIdAndUpdate(user._id, {
        currentWorkspace: workspace._id as unknown as mongoose.Types.ObjectId,
      });
    }

    return { user }; // Return the user object
  } catch (error) {
    throw error; // Rethrow the error
  }
};

export const registerUserService = async (body: {
  email: string; // User's email address
  name: string; // User's name
  password: string; // User's password
}) => {
  const { email, name, password } = body; // Destructure the input body

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists'); // Throw an error if the user exists
    }

    const user = await UserModel.create({
      email, // Set the user's email
      name, // Set the user's name
      password, // Set the user's password
    });

    const account = await AccountModel.create({
      userId: user._id, // Link the account to the newly created user
      provider: ProviderEnum.EMAIL, // Set the provider as email
      providerId: email, // Use the email as the provider ID
    });

    const workspace = await WorkspaceModel.create({
      name: 'My Workspace',
      description: `Workspace created for ${user.name}`,
      owner: user._id,
    });

    const ownerRole = await RoleModel.findOne({ name: Roles.OWNER });
    if (!ownerRole) {
      throw new Error('Owner role not found');
    }

    await MemberModel.create({
      userId: user._id,
      workspaceId: workspace._id as unknown as mongoose.Types.ObjectId,
      role: ownerRole._id,
      joinedAt: new Date(),
    });

    await UserModel.findByIdAndUpdate(user._id, {
      currentWorkspace: workspace._id as unknown as mongoose.Types.ObjectId,
    });

    return { userId: user._id, workspaceId: workspace._id };
  } catch (error) {
    throw error;
  }
};

export const verifyUserService = async ({
  email, // User's email address
  password, // User's password
  provider = ProviderEnum.EMAIL, // Default provider is email
}: {
  email: string; // Email address
  password: string; // Password
  provider?: string; // Optional provider
}) => {
  const account = await AccountModel.findOne({ provider, providerId: email }); // Find the account by provider and provider ID
  if (!account) {
    throw new BadRequestException('Invalid email or password'); // Throw an error if the account is not found
  }
  const user = await UserModel.findById(account.userId); // Find the user by the account's user ID
  if (!user) {
    throw new NotFoundException('User not found'); // Throw an error if the user is not found
  }
  const isPasswordValid = await user.comparePassword(password); // Validate the password
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid email or password'); // Throw an error if the password is invalid
  }
  return user.omitPassword(); // Return the user object without the password
};

export const findUserById = async (userId: string) => {
  const user = await UserModel.findById(userId, {
    password: false,
  }); // Find the user by their ID
  return user || null; // Return the user object
};

