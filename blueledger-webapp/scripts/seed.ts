import mongoose from 'mongoose';
import { hashPassword } from '@/features/auth/utils';
import { EXPENSE_CATEGORIES } from '@/features/expenses/constants';
import Expense from '@/features/expenses/models';
import { FRIENDSHIP_STATUS } from '@/features/friendship/constants';
import Friendship from '@/features/friendship/models';
import { GROUP_MEMBERSHIP_STATUS, GROUP_ROLES, GROUP_STATUS } from '@/features/groups/constants';
import Group, { GroupMembership } from '@/features/groups/models';
import { NOTIFICATION_TYPES } from '@/features/notifications/constants';
import Notification from '@/features/notifications/models';
import User from '@/features/users/models';
import { dummyUsers } from '@/lib/data/dummy-users';

// Custom database connection for seeding
async function connectToSeedDatabase() {
  const seedUri = process.env.MONGODB_SEED_URI || process.env.MONGODB_URI;

  if (!seedUri) {
    throw new Error('Missing environment variable: MONGODB_SEED_URI or MONGODB_URI');
  }

  console.log(`🌱 Connecting to database: ${seedUri.split('@')[1]?.split('/')[0] || 'database'}`);

  try {
    await mongoose.connect(seedUri);
    console.log('✅ Connected to seed database');
  }
  catch (error) {
    console.error('❌ Failed to connect to seed database:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Creating Demo Scenario...');
  console.log('=====================================');

  await connectToSeedDatabase();

  // Generate unique scenario ID to avoid conflicts
  const scenarioId = Date.now().toString();
  console.log(`📋 Scenario ID: ${scenarioId}`);

  // Create all 20 users from dummy-users with hashed passwords
  console.log('👥 Creating users...');
  const hashedPassword = await hashPassword('password123');

  const userData = dummyUsers.map(user => ({
    ...user,
    _id: new mongoose.Types.ObjectId(),
    passwordHash: hashedPassword,
    bio: `${user.name} - Demo User ${scenarioId}`,
    imagePublicId: '',
    // Add scenario ID to email to make them unique
    email: user.email.replace('@', `-${scenarioId}@`),
  }));

  const createdUsers = await User.insertMany(userData);
  const userIds: mongoose.Types.ObjectId[] = createdUsers.map(user => user._id as mongoose.Types.ObjectId);

  console.log(`✅ Created ${userData.length} users`);

  // Create random friendships between users
  console.log('🤝 Creating friendships...');
  const friendships: Array<{
    requester: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    status: string;
    acceptedAt: Date | null;
    createdAt: Date;
  }> = [];
  for (let i = 0; i < userIds.length; i++) {
    // Each user gets 2-4 random friends
    const numFriends = Math.floor(Math.random() * 3) + 2;
    const availableFriends = userIds.filter((_, index) => index !== i);

    for (let j = 0; j < numFriends; j++) {
      const randomFriendIndex = Math.floor(Math.random() * availableFriends.length);
      const friendId = availableFriends[randomFriendIndex];

      // Avoid duplicate friendships
      const friendshipExists = friendships.some(f =>
        (f.requester.equals(userIds[i]!) && f.recipient.equals(friendId as mongoose.Types.ObjectId))
        || (f.requester.equals(friendId as mongoose.Types.ObjectId) && f.recipient.equals(userIds[i]!)),
      );

      if (!friendshipExists) {
        const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Within last 30 days
        const isAccepted = Math.random() > 0.3;
        const acceptedAt = isAccepted
          ? new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) // 0-7 days after creation
          : null;

        friendships.push({
          requester: userIds[i]!,
          recipient: friendId as mongoose.Types.ObjectId,
          status: isAccepted ? FRIENDSHIP_STATUS.ACCEPTED : FRIENDSHIP_STATUS.PENDING,
          acceptedAt,
          createdAt,
        });
      }

      // Remove from available friends to avoid too many connections
      availableFriends.splice(randomFriendIndex, 1);
      if (availableFriends.length === 0)
        break;
    }
  }

  await Friendship.insertMany(friendships);
  console.log(`✅ Created ${friendships.length} friendships`);

  // Create groups with mixed ownership and memberships
  console.log('👥 Creating groups...');
  const groups = [];
  const groupNames = [
    'Team Lunch Squad',
    'Weekend Warriors',
    'Coffee Lovers',
    'Project Phoenix',
    'Happy Hour Crew',
    'Book Club',
    'Fitness Fanatics',
    'Game Night',
    'Travel Enthusiasts',
    'Study Group',
    'Music Lovers',
    'Foodies United',
  ];

  // Available group illustrations
  const groupIllustrations = [
    '/illustrations/groups/household.svg',
    '/illustrations/groups/office.svg',
    '/illustrations/groups/party.svg',
    '/illustrations/groups/sports.svg',
    '/illustrations/groups/travel.svg',
  ];

  // Create 8 random groups with illustrations
  for (let i = 0; i < 8; i++) {
    const ownerId = userIds[Math.floor(Math.random() * userIds.length)];
    const randomIllustration = groupIllustrations[Math.floor(Math.random() * groupIllustrations.length)];
    // Make most groups active, but ~10% inactive for variety
    const status = Math.random() > 0.1 ? GROUP_STATUS.ACTIVE : GROUP_STATUS.INACTIVE;

    groups.push({
      name: `${groupNames[i]} ${scenarioId}`,
      image: randomIllustration,
      owner: ownerId,
      status,
    });
  }

  const createdGroups = await Group.insertMany(groups);
  console.log(`✅ Created ${groups.length} groups`);

  // Create group memberships with different statuses
  console.log('📝 Creating group memberships...');
  const memberships: Array<{
    group: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    invitedBy: mongoose.Types.ObjectId;
    role: string;
    status: string;
    acceptedAt: Date | null;
    createdAt: Date;
  }> = [];

  createdGroups.forEach((group: any) => {
    // Owner is automatically a member (created when group was created)
    memberships.push({
      group: group._id as mongoose.Types.ObjectId,
      user: group.owner as mongoose.Types.ObjectId,
      invitedBy: group.owner as mongoose.Types.ObjectId,
      role: GROUP_ROLES.OWNER,
      status: GROUP_MEMBERSHIP_STATUS.ACCEPTED,
      acceptedAt: group.createdAt || new Date(),
      createdAt: group.createdAt || new Date(),
    });

    // Add 3-5 random members per group
    const availableUsers = userIds.filter((id: mongoose.Types.ObjectId) => !id.equals(group.owner as mongoose.Types.ObjectId));
    const numMembers = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < numMembers && availableUsers.length > 0; i++) {
      const memberIndex = Math.floor(Math.random() * availableUsers.length);
      const memberId = availableUsers[memberIndex];

      // Invitations happen sometime after group creation
      const invitationCreatedAt = new Date((group.createdAt || new Date()).getTime() + Math.random() * 15 * 24 * 60 * 60 * 1000); // 0-15 days after group creation
      const isAccepted = Math.random() > 0.2;
      const acceptedAt = isAccepted
        ? new Date(invitationCreatedAt.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000) // 0-3 days after invitation
        : null;

      memberships.push({
        group: group._id as mongoose.Types.ObjectId,
        user: memberId as mongoose.Types.ObjectId,
        invitedBy: group.owner as mongoose.Types.ObjectId,
        role: GROUP_ROLES.MEMBER,
        status: isAccepted ? GROUP_MEMBERSHIP_STATUS.ACCEPTED : GROUP_MEMBERSHIP_STATUS.PENDING,
        acceptedAt,
        createdAt: invitationCreatedAt,
      });

      availableUsers.splice(memberIndex, 1);
    }
  });

  await GroupMembership.insertMany(memberships);
  console.log(`✅ Created ${memberships.length} group memberships`);

  // Create LOTS of expenses for each user with realistic timing and category distribution
  console.log('💰 Creating expenses...');
  const allExpenses = [];

  // Realistic category distribution weights (higher = more frequent)
  // Based on real spending patterns: Food & Bills are most consistent,
  // Shopping is common, Other occasional, Entertainment less frequent, Travel rare but substantial
  const categoryWeights = {
    [EXPENSE_CATEGORIES.FOOD]: 35, // ~35% - daily/weekly meals, coffee, groceries
    [EXPENSE_CATEGORIES.BILLS_AND_UTILITIES]: 25, // ~25% - monthly utilities, rent, insurance
    [EXPENSE_CATEGORIES.SHOPPING]: 20, // ~20% - weekly/bi-weekly purchases
    [EXPENSE_CATEGORIES.OTHER]: 12, // ~12% - occasional miscellaneous
    [EXPENSE_CATEGORIES.ENTERTAINMENT]: 6, // ~6% - movies, concerts, games (bi-weekly/monthly)
    [EXPENSE_CATEGORIES.TRAVEL]: 2, // ~2% - flights, hotels, gas (every 3-6 months)
  };

  // Create weighted category selection function
  function selectWeightedCategory(): string {
    const totalWeight = Object.values(categoryWeights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (const [category, weight] of Object.entries(categoryWeights)) {
      random -= weight;
      if (random <= 0) {
        return category;
      }
    }

    return EXPENSE_CATEGORIES.OTHER; // fallback
  }

  for (const userId of userIds) {
    // Each user gets 100-200 expenses
    const expenseCount = Math.floor(Math.random() * 100) + 100;

    for (let i = 0; i < expenseCount; i++) {
      const category = selectWeightedCategory();
      const daysAgo = Math.floor(Math.random() * 365); // Last year

      // Create realistic time patterns based on category and human behavior
      let hour: number, minute: number;

      switch (category) {
        case EXPENSE_CATEGORIES.FOOD: {
          // Meal times: breakfast (7-9), lunch (12-14), dinner (18-21), snacks (anytime)
          const mealTimes = [
            { hour: 7 + Math.floor(Math.random() * 3), desc: 'Breakfast' }, // 7-9 AM
            { hour: 12 + Math.floor(Math.random() * 3), desc: 'Lunch' }, // 12-2 PM
            { hour: 18 + Math.floor(Math.random() * 4), desc: 'Dinner' }, // 6-9 PM
            { hour: Math.floor(Math.random() * 24), desc: 'Snacks' }, // Anytime
          ];
          const meal = mealTimes[Math.floor(Math.random() * mealTimes.length)];
          if (meal) {
            hour = meal.hour;
            minute = Math.floor(Math.random() * 60);
          }
          else {
            hour = Math.floor(Math.random() * 24);
            minute = Math.floor(Math.random() * 60);
          }
          break;
        }

        case EXPENSE_CATEGORIES.ENTERTAINMENT:
          // Evenings/weekends: 18-23 PM
          hour = 18 + Math.floor(Math.random() * 6);
          minute = Math.floor(Math.random() * 60);
          break;

        case EXPENSE_CATEGORIES.SHOPPING:
          // Shopping during work hours or evenings: 10 AM - 9 PM
          hour = 10 + Math.floor(Math.random() * 12);
          minute = Math.floor(Math.random() * 60);
          break;

        case EXPENSE_CATEGORIES.TRAVEL: {
          // Travel during commute times: 7-9 AM, 5-7 PM, or anytime for vacations
          const isCommute = Math.random() > 0.3;
          if (isCommute) {
            hour = Math.random() > 0.5 ? 7 + Math.floor(Math.random() * 3) : 17 + Math.floor(Math.random() * 3);
          }
          else {
            hour = Math.floor(Math.random() * 24);
          }
          minute = Math.floor(Math.random() * 60);
          break;
        }

        case EXPENSE_CATEGORIES.BILLS_AND_UTILITIES:
          // Bills paid during work hours or evenings: 9 AM - 8 PM
          hour = 9 + Math.floor(Math.random() * 12);
          minute = Math.floor(Math.random() * 60);
          break;

        default:
          // Random time for other categories
          hour = Math.floor(Math.random() * 24);
          minute = Math.floor(Math.random() * 60);
      }

      // Create the date with realistic time
      const baseDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      const date = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hour, minute);

      let price = 0;
      let description = '';
      let quantity = 1;

      // Generate realistic expenses based on category with varying quantities
      switch (category) {
        case EXPENSE_CATEGORIES.FOOD: {
          // Food: Frequent, modest amounts ($5-80 per item)
          price = Math.random() * 75 + 5;
          const foodOptions = ['Coffee', 'Lunch', 'Dinner', 'Groceries', 'Snacks', 'Restaurant'];
          const selectedFood = foodOptions[Math.floor(Math.random() * foodOptions.length)];
          description = selectedFood || 'Food';
          // Food can have quantities 1-5 (people buy multiple coffees, snacks, etc.)
          quantity = Math.floor(Math.random() * 5) + 1;
          break;
        }
        case EXPENSE_CATEGORIES.ENTERTAINMENT: {
          // Entertainment: Less frequent, moderate amounts ($10-150 per item)
          price = Math.random() * 140 + 10;
          const entertainmentOptions = ['Movie tickets', 'Concert tickets', 'Streaming service', 'Video games', 'Books', 'Theater show'];
          const selectedEntertainment = entertainmentOptions[Math.floor(Math.random() * entertainmentOptions.length)];
          description = selectedEntertainment || 'Entertainment';
          // Entertainment usually quantity 1, but sometimes multiple tickets
          quantity = Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 1;
          break;
        }
        case EXPENSE_CATEGORIES.SHOPPING: {
          // Shopping: Common, varied amounts ($15-300 per item)
          price = Math.random() * 285 + 15;
          const shoppingOptions = ['Clothes', 'Electronics', 'Home goods', 'Gifts', 'Accessories', 'Books'];
          const selectedShopping = shoppingOptions[Math.floor(Math.random() * shoppingOptions.length)];
          description = selectedShopping || 'Shopping';
          // Shopping can have quantities 1-3 (buying multiple items)
          quantity = Math.floor(Math.random() * 3) + 1;
          break;
        }
        case EXPENSE_CATEGORIES.TRAVEL: {
          // Travel: Rare but substantial ($50-2000 per item)
          price = Math.random() * 1950 + 50;
          const travelOptions = ['Gas', 'Uber/Lyft', 'Flight tickets', 'Hotel stay', 'Train tickets', 'Bus fare'];
          const selectedTravel = travelOptions[Math.floor(Math.random() * travelOptions.length)];
          description = selectedTravel || 'Travel';
          // Travel can have quantities 1-4 (multiple tickets, rides, hotel nights, etc.)
          quantity = Math.floor(Math.random() * 4) + 1;
          break;
        }
        case EXPENSE_CATEGORIES.BILLS_AND_UTILITIES: {
          // Bills: Regular, consistent amounts ($30-250 per bill)
          price = Math.random() * 220 + 30;
          const billOptions = ['Electricity bill', 'Internet bill', 'Phone bill', 'Water bill', 'Insurance premium', 'Rent payment'];
          const selectedBill = billOptions[Math.floor(Math.random() * billOptions.length)];
          description = selectedBill || 'Bills & Utilities';
          // Bills are usually quantity 1
          quantity = 1;
          break;
        }
        default:
          price = Math.random() * 100 + 10;
          description = 'Miscellaneous';
          quantity = 1;
      }

      allExpenses.push({
        description: `${description} ${scenarioId}`,
        price: Math.round(price * 100) / 100,
        quantity,
        totalPrice: Math.round((price * quantity) * 100) / 100,
        category,
        date,
        user: userId,
      });
    }
  }

  await Expense.insertMany(allExpenses);
  console.log(`✅ Created ${allExpenses.length} expenses`);

  // Log category distribution for verification
  const categoryCount: Record<string, number> = {};
  allExpenses.forEach((expense) => {
    categoryCount[expense.category] = (categoryCount[expense.category] || 0) + 1;
  });

  console.log('📊 Category Distribution:');
  Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      const percentage = ((count / allExpenses.length) * 100).toFixed(1);
      console.log(`   ${category}: ${count} (${percentage}%)`);
    });

  // Create notifications for every user (guaranteed)
  console.log('🔔 Creating notifications...');
  const notifications: Array<{
    user: mongoose.Types.ObjectId;
    fromUser: mongoose.Types.ObjectId;
    type: string;
    isRead: boolean;
    createdAt: Date;
  }> = [];

  userIds.forEach((_userId, _userIndex) => {
    // Each user gets 5-8 notifications minimum
    const numNotifications = Math.floor(Math.random() * 4) + 5;

    for (let i = 0; i < numNotifications; i++) {
      // Get a random user that's not the current user
      let fromUser: mongoose.Types.ObjectId;
      do {
        const randomIndex = Math.floor(Math.random() * userIds.length);
        fromUser = userIds[randomIndex]!;
      } while (fromUser.equals(_userId));

      // Mix different notification types
      const notificationTypes = [
        NOTIFICATION_TYPES.FRIEND_REQUEST,
        NOTIFICATION_TYPES.FRIEND_REQUEST,
        NOTIFICATION_TYPES.FRIEND_REQUEST, // More friend requests
        NOTIFICATION_TYPES.ADDED_TO_EXPENSE,
        NOTIFICATION_TYPES.GROUP_INVITE,
      ];

      const randomIndex = Math.floor(Math.random() * notificationTypes.length);
      const type = notificationTypes[randomIndex] || NOTIFICATION_TYPES.FRIEND_REQUEST;

      // Create notification at a realistic time (within last 30 days)
      const notificationCreatedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

      notifications.push({
        user: _userId,
        fromUser,
        type,
        isRead: Math.random() > 0.6, // 40% unread for realism
        createdAt: notificationCreatedAt,
      });
    }

    // Ensure at least one friend request per user (realistic)
    const hasFriendRequest = notifications.some(n =>
      n.user.equals(_userId) && n.type === NOTIFICATION_TYPES.FRIEND_REQUEST,
    );

    if (!hasFriendRequest) {
      let fromUser: mongoose.Types.ObjectId;
      do {
        const randomIndex = Math.floor(Math.random() * userIds.length);
        fromUser = userIds[randomIndex]!;
      } while (fromUser.equals(_userId));

      // Create friend request notification at a realistic time
      const friendRequestCreatedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

      notifications.push({
        user: _userId,
        fromUser,
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: Math.random() > 0.5,
        createdAt: friendRequestCreatedAt,
      });
    }
  });

  await Notification.insertMany(notifications);
  console.log(`✅ Created ${notifications.length} notifications (${Math.round(notifications.length / userIds.length)} per user average)`);

  // Display login credentials
  console.log('\n🎉 Demo Scenario Created Successfully!');
  console.log('=====================================');
  console.log(`\n📋 LOGIN CREDENTIALS:`);
  console.log(`Password: password123`);
  console.log(`\n📧 User Emails:`);

  userData.forEach((user) => {
    console.log(`  ${user.name}: ${user.email}`);
  });

  console.log('\n🚀 Pick any login above for demos!');
  console.log(`\n💡 Scenario ID: ${scenarioId} (for reference)`);

  // Close database connection
  await mongoose.disconnect();
  console.log('🔌 Database connection closed');
}

main()
  .then(async () => {
    console.log('\n✨ Ready for demos!');
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('❌ Seed failed:', err);
    // Ensure database connection is closed on error
    try {
      await mongoose.disconnect();
      console.log('🔌 Database connection closed');
    }
    catch (disconnectError) {
      console.error('❌ Failed to close database connection:', disconnectError);
    }
    process.exit(1);
  });
