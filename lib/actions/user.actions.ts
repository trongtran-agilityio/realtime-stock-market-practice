'use server';

import { connectToDatabase } from "@/database/mongoose";

export const getAllUsersForNewsEmail = async () => {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Mongoose connection not connected.');

    const users = await db.collection('user')
      .find(
        { email: { $exists: true, $ne: null } },
        { projection: { _id: 1, id: 1, email: 1, name: 1, country: 1 } }
      ).toArray();

    return users.filter((user) => user.email && user.name)
      .map((user) => ({
        id: user.id || user._id?.toString() || '',
        email: user.email,
        name: user.name,
        country: user.country
      }));

  } catch (e) {
    console.error('Error fetching users for news email: ', e);
    return [];
  }
}

export const updateCountryForUserEmail = async (email: string, country: string) => {
  try {
    if (!email) throw new Error('Email is required.');

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Mongoose connection not connected.');

    const result = await db.collection('user').updateOne(
      { email: email },
      { $set: { country: country } },
      { upsert: false }
    );

    return {
      success: result.matchedCount > 0,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    } as const;

  } catch (e) {
    console.error('Error updating country for user email: ', e);
    return { success: false, error: e instanceof Error ? e.message : 'Unknown error' } as const;
  }
}
