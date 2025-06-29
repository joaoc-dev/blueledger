import User from '@/models/user.model';
import { dummyUsers } from '@/lib/data/dummy-users';
import dbConnect from '@/lib/db/mongoose-client';
import mongoose from 'mongoose';

async function main() {
  await dbConnect();

  const exceptUsers = [new mongoose.Types.ObjectId('685287dc739c1c2fd7d8922e')];

  await User.deleteMany({
    _id: { $nin: exceptUsers },
  });
  await User.insertMany(dummyUsers);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
