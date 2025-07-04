import 'dotenv/config';
import mongoose from 'mongoose';
import connectDatabase from '../config/database.config';
import RoleModel from '../models/roles-permission.model';
import { RolePermissions } from '../utils/role-permission';

const seedRoles = async () => {
  console.log('Seeding role started...');

  try {
    await connectDatabase();

    console.log('Clearing existing roles');
    await RoleModel.deleteMany({});

    for (const roleName in RolePermissions) {
      const role = roleName as keyof typeof RolePermissions;
      const permissions = RolePermissions[role];

      const existingRole = await RoleModel.findOne({ name: role });
      if (!existingRole) {
        const newRole = new RoleModel({
          name: role,
          permissions: permissions,
        });
        await newRole.save();
        console.log(`Role ${role} added with permissions.`);
      } else {
        console.log(`Role ${role} already exists.`);
      }
    }

    console.log('Seeding completed successfully.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedRoles().catch((error) => console.error('Error running seed script', error));

