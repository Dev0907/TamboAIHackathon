import { v4 as uuidv4 } from 'uuid';

export const CURRENT_USER_ID = 'user-1';

export const USERS = [
  { id: 'user-1', name: 'Dev Parikh', email: 'devparikh200479@gmail.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev' },
  { id: 'user-2', name: 'Jay', email: 'jay@demo.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jay' },
  { id: 'user-3', name: 'Ram', email: 'ram@demo.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ram' },
  { id: 'user-4', name: 'Vansh', email: 'vansh@demo.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vansh' },
  { id: 'user-5', name: 'Raj', email: 'raj@demo.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj' },
  { id: 'user-6', name: 'Shiv', email: 'shiv@demo.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shiv' },
];

export const GROUPS = [
  {
    id: 'group-1',
    name: 'Bangalore Flat 402',
    members: ['user-1', 'user-2', 'user-3'],
    type: 'Home',
    created_at: new Date(2023, 0, 1).toISOString()
  },
  {
    id: 'group-2',
    name: 'Goa Trip 2024',
    members: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6'],
    type: 'Trip',
    created_at: new Date(2024, 0, 15).toISOString()
  },
  {
    id: 'group-3',
    name: 'Office Lunch Crew',
    members: ['user-1', 'user-5', 'user-6'],
    type: 'Food',
    created_at: new Date(2024, 2, 10).toISOString()
  },
  {
    id: 'group-4',
    name: 'Vegas Trip',
    members: ['user-1', 'user-2', 'user-4'],
    type: 'Trip',
    created_at: new Date(2023, 5, 15).toISOString()
  }
];

// Helper to create expense
const createExpense = (desc, amount, payerId, group, date, category) => {
  const groupObj = GROUPS.find(g => g.id === group);
  const memberIds = groupObj ? groupObj.members : USERS.map(u => u.id);
  const splitAmount = parseFloat((amount / memberIds.length).toFixed(2));

  return {
    id: uuidv4(),
    description: desc,
    amount: amount,
    paidBy: payerId,
    groupId: group,
    date: date.toISOString(),
    category: category,
    splits: memberIds.map(mid => ({
      userId: mid,
      amount: splitAmount
    }))
  };
};

const today = new Date();
const subDays = (d, days) => {
  const result = new Date(d);
  result.setDate(result.getDate() - days);
  return result;
};

/* 
  SCENARIO MAPPING:
  1. Dev (user-1): "The Sponsor" - Pays big bills (Rent, Flights). Consistent habits (Prediction friendly).
  2. Jay (user-2): "The Freeloader/Balancer" - Pays small frequent items (WiFi, Electricity). High debt in Trips.
  3. Ram (user-3): "Zen Master" - Settles instantly. Pays medium items (Maid, Water). Healthy stats.
  4. Vansh (user-4): "Anomalous Spender" - Random huge spikes (Casino, Adventure). Triggers Anomalies.
  5. Raj (user-5): "Fair Player" - Only pays his share. Very balanced history.
*/

export const EXPENSES = [
  // --- GROUP 1: Bangalore Flat 402 (Home) ---
  // Dev pays Rent consistently (Prediction Data)
  createExpense('Rent - March', 24000, 'user-1', 'group-1', subDays(today, 5), 'Rent'),
  createExpense('Rent - Feb', 24000, 'user-1', 'group-1', subDays(today, 35), 'Rent'),
  createExpense('Rent - Jan', 24000, 'user-1', 'group-1', subDays(today, 65), 'Rent'),

  // Jay pays Utilities (Small, recurring)
  createExpense('WiFi Bill', 1400, 'user-2', 'group-1', subDays(today, 2), 'Utilities'),
  createExpense('Electricity', 3200, 'user-2', 'group-1', subDays(today, 25), 'Utilities'),
  createExpense('Gas Cylinder', 1100, 'user-2', 'group-1', subDays(today, 15), 'Utilities'),

  // Ram pays Services (Medium)
  createExpense('Maid Salary', 4500, 'user-3', 'group-1', subDays(today, 3), 'Services'),
  createExpense('Cook Salary', 5000, 'user-3', 'group-1', subDays(today, 3), 'Services'),
  createExpense('Water Cans', 800, 'user-3', 'group-1', subDays(today, 10), 'Groceries'),

  // Groceries (Mixed Payers)
  createExpense('BigBasket Monthly', 5600, 'user-1', 'group-1', subDays(today, 8), 'Groceries'),
  createExpense('Zepto Snacks', 450, 'user-2', 'group-1', subDays(today, 1), 'Food'),

  // --- GROUP 2: Goa Trip 2024 (Trip - High Spend) ---
  // Dev & Vansh Heavy Lifting
  createExpense('Villa Advance', 25000, 'user-1', 'group-2', subDays(today, 20), 'Travel'), // Heavy
  createExpense('Flight Booking (Bulk)', 45000, 'user-1', 'group-2', subDays(today, 22), 'Travel'), // Anomaly for Dev

  // Vansh's Wild Spending (Anomalies)
  createExpense('Casino Royale Entry', 18000, 'user-4', 'group-2', subDays(today, 18), 'Entertainment'), // Anomaly!
  createExpense('Jet Ski Rentals', 6000, 'user-4', 'group-2', subDays(today, 17), 'Entertainment'),
  createExpense('Lost Bet', 5000, 'user-4', 'group-2', subDays(today, 16), 'Entertainment'),

  // Raj & Shiv (Smaller Food items)
  createExpense('Thalassa Dinner', 12000, 'user-5', 'group-2', subDays(today, 18), 'Food'),
  createExpense('Curlies Drinks', 4500, 'user-6', 'group-2', subDays(today, 17), 'Food'),
  createExpense('Scooty Rent', 3500, 'user-5', 'group-2', subDays(today, 19), 'Transport'),

  // --- GROUP 3: Office Lunch Crew (Daily Food) ---
  // Raj pays most often here (Habitual)
  createExpense('Subway', 450, 'user-5', 'group-3', subDays(today, 1), 'Food'),
  createExpense('Chai Point', 150, 'user-5', 'group-3', subDays(today, 1), 'Food'),
  createExpense('Burger King', 850, 'user-5', 'group-3', subDays(today, 2), 'Food'),
  createExpense('Pizza Hut', 2200, 'user-6', 'group-3', subDays(today, 4), 'Food'),
  createExpense('Starbucks', 1800, 'user-1', 'group-3', subDays(today, 3), 'Food'), // Dev treats occasionally

  // --- GROUP 4: Vegas Trip (Legacy / International) ---
  createExpense('Caesars Palace Suite', 800, 'user-1', 'group-4', subDays(today, 90), 'Travel'), // USD context implicitly handled as number
  createExpense('Helicopter Tour', 450, 'user-2', 'group-4', subDays(today, 91), 'Entertainment'),
  createExpense('Limousine', 200, 'user-4', 'group-4', subDays(today, 92), 'Transport'),
  createExpense('Buffet Pass', 300, 'user-1', 'group-4', subDays(today, 91), 'Food'),
];
