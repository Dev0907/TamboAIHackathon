export const TAMBO_API_KEY = import.meta.env.VITE_TAMBO_API_KEY;

// This service mimics the Tambo AI SDK processing locally for offline-first privacy
import { addExpense } from '../../store/slices/expenseSlice';
import { addGroup } from '../../store/slices/groupSlice';
import { v4 as uuidv4 } from 'uuid';
import {
  makeGetGroupAnalytics,
  makeGetUserAnalytics,
  getExpensePrediction,
  getAnomalies,
  getSpendingPersonality,
  getGroupHealth
} from '../../utils/analytics';
import { selectAllExpenses } from '../../store/slices/expenseSlice';
import { selectGroups } from '../../store/slices/groupSlice';

// Regex Patterns
const PATTERNS = {
  ADD_EXPENSE: /add\s+(?:₹|\$)?(\d+(?:\.\d{2})?)\s+(?:for\s+)?(.+?)\s+(?:paid\s+by\s+)(\w+)/i,
  CREATE_GROUP: /create\s+(?:a\s+)?(.+?)\s+group\s+with\s+(.+)/i,
  PREDICT: /predict|future|forecast/i,
  PERSONALITY: /personality|spender\s+type|what\s+kind\s+of\s+spender/i,
  HEALTH: /health|score|safe/i,
  ANOMALY: /unusual|anomaly|weird|spike/i
};

export class TamboAgent {
  constructor(store, navigate) {
    this.store = store;
    this.navigate = navigate;
  }

  // Improved Entity Extraction (Fuzzy Match & IDs)
  extractEntities(input) {
    const state = this.store.getState();
    const groups = selectGroups(state);
    const users = state.users.users;

    const cleanInput = input.toLowerCase().replace(/[^a-z0-9\s]/g, ''); // Keep spaces for word-boundary checks

    // 1. Find Group
    // Matches "Group 1", "Goa Trip", "group-1"
    const groupMatch = groups.find(g => {
      const cleanName = g.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanId = g.id.toLowerCase().replace(/[^a-z0-9]/g, ''); // group1
      const inputSimple = cleanInput.replace(/\s/g, '');
      return inputSimple.includes(cleanName) || inputSimple.includes(cleanId);
    });

    // 2. Find Target Users (Array)
    // Matches names "Ram", "User 3", "Me"
    const matchedUsers = users.filter(u => {
      // "Me" / "My" check
      if (u.id === state.users.currentUser.id && input.match(/\b(me|my|i)\b/i)) return true;

      const cleanName = u.name.toLowerCase();
      const cleanId = u.id.toLowerCase().replace(/[^a-z0-9]/g, ''); // user3

      // Name loose match ("Ram" in "Ram spending")
      const nameMatch = input.toLowerCase().includes(cleanName.split(' ')[0]); // Match first name "Ram"

      // ID Fuzzy Match ("User 3" for "user-3")
      const inputSimple = cleanInput.replace(/\s/g, ''); // "user3"
      const idMatch = inputSimple.includes(cleanId);

      return nameMatch || idMatch;
    });

    return {
      targetGroup: groupMatch,
      targetUsers: matchedUsers.length > 0 ? matchedUsers : null
    };
  }

  process(userInput) {
    const input = userInput.trim();
    const { targetGroup, targetUsers } = this.extractEntities(input);
    const hasUserIntent = input.match(/user|member|person|who/i);

    // 1. Navigation (Direct Jumps)
    if (input.match(/dashboard|home/i)) {
      this.navigate('/app');
      return { text: "Opening your main dashboard.", type: 'action' };
    }

    // 2. Action Commands (High Priority)
    const expenseMatch = input.match(PATTERNS.ADD_EXPENSE);
    if (expenseMatch) return this.handleAddExpense(expenseMatch);

    const groupMatch = input.match(PATTERNS.CREATE_GROUP);
    if (groupMatch) return this.handleCreateGroup(groupMatch);

    // 3. Advanced Intelligence (Highest Specificity)
    if (input.match(PATTERNS.PREDICT)) return this.handlePrediction();
    if (input.match(PATTERNS.PERSONALITY)) return this.handlePersonality();
    if (input.match(PATTERNS.ANOMALY)) return this.handleAnomalies();

    // New Feature: Settlement Advice
    if (input.match(/settle|pay|clear debt/i)) return this.handleSettlement();

    // New Feature: Savings Tip
    if (input.match(/save|tip|advice|budget/i)) return this.handleSmartTip();

    // Health is special: Can be Group-Specific or General
    if (input.match(PATTERNS.HEALTH)) {
      return this.handleGroupHealth(targetGroup); // specific or default
    }

    // 4. Specific Visualizations (Trend / Bar)
    if (input.match(/line|chart|trend/i)) {
      // Support "Jay trend" or "My trend"
      const user = targetUsers ? targetUsers[0] : null;
      return this.handleTrendQuery(user);
    }
    if (input.match(/compare|bar|breakdown/i) && !targetGroup && !targetUsers) return this.handleSpendingBarQuery();

    // 5. Entity Specific Queries (Contextual)
    // "User 3 spending", "Jay vs Ram", "Group 1 spending", "Goa Trip user wise spend"
    if (targetGroup || targetUsers) {
      if (input.match(/spend|spent|expenses|breakdown|cost/i)) {
        // Special Case: "Group breakdown" -> Bar chart
        if (targetGroup && (!targetUsers || hasUserIntent) && input.match(/breakdown|wise|split/i)) {
          return this.handleGroupMemberBreakdown(targetGroup);
        }
        return this.handleEntitySpending(targetGroup, targetUsers);
      }

      // Fallback: If Group is named but no specific command ("Goa Trip"), show overview
      if (targetGroup) {
        return this.handleGroupMemberBreakdown(targetGroup);
      }
    }

    // 6. Global/General Queries (Fallbacks)
    if (input.match(/owe|debt|balance/i)) return this.handleOweQuery();

    // "Show my spending" (Global)
    if (input.match(/spend|spent|pie/i)) return this.handleSpendingQuery();

    // "Show expenses" (List)
    if (input.match(/expenses|history|transactions/i)) {
      const state = this.store.getState();
      const expenses = selectAllExpenses(state).slice(0, 5);
      return { text: "Here are your 5 most recent expenses.", type: 'list-expenses', data: expenses };
    }

    if (input.match(/groups/i)) {
      const state = this.store.getState();
      const groups = selectGroups(state);
      return { text: "Here are all your active groups.", type: 'list-groups', data: groups };
    }

    // Smart Fallback for Partial Matches
    if (targetGroup) return this.handleGroupMemberBreakdown(targetGroup);

    return {
      text: "I didn't quite catch that. Try 'Predict expenses', 'Group 1 health', or 'Vansh spending'.",
      type: 'text'
    };
  }

  // --- New Handlers ---

  handleGroupMemberBreakdown(group) {
    const state = this.store.getState();
    const analytics = makeGetGroupAnalytics()(state, group.id);

    // Transform memberStats for bar chart
    // user => { paid: X, share: Y }
    const users = state.users.users;
    const data = Object.entries(analytics.memberStats).map(([userId, stats]) => {
      const u = users.find(u => u.id === userId);
      return {
        name: u ? u.name.split(' ')[0] : 'Unknown',
        value: stats.share // or paid, usually share is better for consumption
      };
    }).sort((a, b) => b.value - a.value);

    return {
      text: `Member spending breakdown for ${group.name} (Share):`,
      type: 'chart-bar',
      data: data
    };
  }

  handleEntitySpending(group, usersList) {
    const state = this.store.getState();

    // 1. Specific User(s)
    if (usersList && usersList.length > 0) {
      // If multiple users, show comparison bar chart
      if (usersList.length > 1) {
        const data = usersList.map(u => {
          let amount = 0;
          if (group) {
            // In specific group
            const allExpenses = selectAllExpenses(state);
            amount = allExpenses
              .filter(e => e.groupId === group.id && e.splits.some(s => s.userId === u.id))
              .reduce((sum, e) => sum + (e.splits.find(s => s.userId === u.id)?.amount || 0), 0);
          } else {
            // Global
            const analytics = makeGetUserAnalytics()(state, u.id);
            amount = analytics.totalShare;
          }
          return { name: u.name.split(' ')[0], value: amount };
        });

        return {
          text: `Spending comparison: ${usersList.map(u => u.name).join(' vs ')}`,
          type: 'chart-bar',
          data: data
        };
      }

      // Single User
      const user = usersList[0];
      let amount = 0;
      let context = "";

      if (group) {
        const allExpenses = selectAllExpenses(state);
        amount = allExpenses
          .filter(e => e.groupId === group.id && e.splits.some(s => s.userId === user.id))
          .reduce((sum, e) => sum + (e.splits.find(s => s.userId === user.id)?.amount || 0), 0);
        context = `in ${group.name}`;
      } else {
        const analytics = makeGetUserAnalytics()(state, user.id);
        amount = analytics.totalShare;
        context = "total";
      }

      return {
        text: `${user.name} has spent $${amount.toFixed(2)} ${context}.`,
        type: 'text'
      };
    }

    // 2. Specific Group (General)
    if (group) {
      const analytics = makeGetGroupAnalytics()(state, group.id);
      return {
        text: `Spending breakdown for ${group.name}.`,
        type: 'chart-spending',
        data: Object.entries(analytics.categoryBreakdown).map(([name, value]) => ({ name, value }))
      };
    }

    return { text: "Could not analyze spending context.", type: 'text' };
  }

  // --- Intelligence Handlers ---
  handlePrediction() {
    const state = this.store.getState();
    const currentUser = state.users.currentUser;
    const expenses = selectAllExpenses(state);
    const prediction = getExpensePrediction(expenses, currentUser.id);

    return {
      text: `Based on your recent habits, your next month's spending is forecasted.`,
      type: 'card-prediction',
      data: prediction
    };
  }

  handlePersonality() {
    const state = this.store.getState();
    const currentUser = state.users.currentUser;
    const analytics = makeGetUserAnalytics()(state, currentUser.id);
    const personality = getSpendingPersonality(analytics);

    return {
      text: "Here is your spending personality analysis.",
      type: 'badge-personality',
      data: personality
    };
  }

  handleGroupHealth(targetGroup = null) {
    const state = this.store.getState();
    const groups = selectGroups(state);

    const groupToAnalyze = targetGroup || groups[0];

    if (!groupToAnalyze) return { text: "No groups found to analyze.", type: 'text' };

    const analytics = makeGetGroupAnalytics()(state, groupToAnalyze.id);
    const health = getGroupHealth(analytics);

    return {
      text: `Health Score for "${groupToAnalyze.name}":`,
      type: 'card-health',
      data: { ...health, groupName: groupToAnalyze.name }
    };
  }

  handleAnomalies() {
    const state = this.store.getState();
    const currentUser = state.users.currentUser;
    const expenses = selectAllExpenses(state);
    const anomalies = getAnomalies(expenses, currentUser.id);

    if (anomalies.length === 0) return { text: "No unusual spending detected recently. Good job!", type: 'text' };

    return {
      text: `Found ${anomalies.length} unusual expenses that are higher than average.`,
      type: 'list-anomalies',
      data: anomalies
    };
  }

  handleSettlement() {
    const state = this.store.getState();
    const currentUser = state.users.currentUser;
    const analytics = makeGetUserAnalytics()(state, currentUser.id);

    // If positive balance, nothing to pay
    if (analytics.netBalance >= 0) {
      return { text: "Good news! You don't owe anyone right now. You are actually owed money.", type: 'text' };
    }

    // Find who to pay (largest creditor)
    const creditorId = Object.entries(analytics.balanceMap)
      .sort(([, a], [, b]) => a - b)[0][0]; // Sort ascending (most negative first)

    const users = state.users.users;
    const creditor = users.find(u => u.id === creditorId);
    const amount = Math.abs(analytics.balanceMap[creditorId]);

    return {
      text: `You should prioritize settling up with ${creditor.name}.`,
      type: 'card-settlement',
      data: { to: creditor.name, amount: amount }
    };
  }

  handleSmartTip() {
    const state = this.store.getState();
    const currentUser = state.users.currentUser;
    const analytics = makeGetUserAnalytics()(state, currentUser.id);

    // Find top spending category
    if (!analytics.categoryBreakdown.length) return { text: "No spending data to analyze yet.", type: 'text' };

    const topCat = analytics.categoryBreakdown.sort((a, b) => b.value - a.value)[0];

    const tips = {
      'Food': "You're spending a lot on Food. Try meal prepping for 2 days a week to save ~₹4000/month.",
      'Travel': "Travel is your top expense. Booking flights 45 days in advance usually saves 20%.",
      'Rent': "Rent is unavoidable, but have you checked if paying annually gets a discount?",
      'Entertainment': "Fun is important! But limiting 'big nights out' to once a month can cut costs by 30%.",
      'Utilities': "Unplug distinct devices at night. It actually reduces the bill by 5-10%!"
    };

    return {
      text: tips[topCat.name] || `Try setting a budget for ${topCat.name} to track it better.`,
      type: 'card-tip',
    };
  }

  // --- Core Handlers ---
  handleAddExpense(match) {
    const amount = parseFloat(match[1]);
    const desc = match[2];
    const payerName = match[3];

    const state = this.store.getState();
    const users = state.users.users;
    const payer = users.find(u => u.name.toLowerCase().includes(payerName.toLowerCase()));

    if (!payer) {
      return { text: `Could not find user "${payerName}". Available users: ${users.map(u => u.name).join(', ')}`, type: 'text' };
    }

    const newExpense = {
      id: uuidv4(),
      description: desc,
      amount: amount,
      paidBy: payer.id,
      groupId: 'group-1',
      date: new Date().toISOString(),
      category: 'Food',
      splits: state.users.users.map(u => ({
        userId: u.id,
        amount: parseFloat((amount / state.users.users.length).toFixed(2))
      }))
    };

    this.store.dispatch(addExpense(newExpense));
    return {
      text: `Added expense: ${desc} for $${amount}.`,
      type: 'card-expense',
      data: newExpense
    };
  }

  handleCreateGroup(match) {
    const name = match[1];

    const newGroup = {
      id: uuidv4(),
      name: name,
      members: ['user-1', 'user-2'],
      type: 'Trip',
      created_at: new Date().toISOString()
    };

    this.store.dispatch(addGroup(newGroup));
    return {
      text: `Created group "${name}".`,
      type: 'card-group',
      data: newGroup
    };
  }

  handleTrendQuery(targetUser = null) {
    const state = this.store.getState();
    const currentUser = state.users.currentUser;

    const userToAnalyze = targetUser || currentUser;
    const analytics = makeGetUserAnalytics()(state, userToAnalyze.id);

    if (!analytics.spendingHistory || analytics.spendingHistory.length === 0) {
      return { text: `Not enough data to show a trend for ${userToAnalyze.name} yet.`, type: 'text' };
    }

    return {
      text: `Here represents ${userToAnalyze.id === currentUser.id ? 'your' : userToAnalyze.name + "'s"} spending habit over time.`,
      type: 'chart-trend-line',
      data: analytics.spendingHistory
    };
  }

  handleSpendingBarQuery() {
    const state = this.store.getState();
    const currentUser = state.users.currentUser;
    const analytics = makeGetUserAnalytics()(state, currentUser.id);

    return {
      text: "Here is your spending compared across categories.",
      type: 'chart-bar',
      data: analytics.categoryBreakdown
    };
  }

  handleOweQuery() {
    const state = this.store.getState();
    const currentUser = state.users.currentUser;
    const analytics = makeGetUserAnalytics()(state, currentUser.id);

    // Transform balance map for visualization
    const users = state.users.users;
    const data = Object.entries(analytics.balanceMap)
      .filter(([_, amount]) => Math.abs(amount) > 0)
      .map(([userId, amount]) => {
        const u = users.find(u => u.id === userId);
        return {
          name: u ? u.name.split(' ')[0] : 'User',
          value: Math.abs(amount)
        };
      });

    const isOwed = analytics.netBalance >= 0;

    return {
      text: isOwed
        ? `You are owed $${analytics.netBalance.toFixed(2)}. Breakdown:`
        : `You owe a total of $${Math.abs(analytics.netBalance).toFixed(2)}. Breakdown:`,
      type: 'chart-balance',
      data: data // Now an array compatible with Pie/Bar charts
    };
  }

  handleSpendingQuery() {
    const state = this.store.getState();
    const currentUser = state.users.currentUser;
    const analytics = makeGetUserAnalytics()(state, currentUser.id);

    const topCategory = analytics.categoryBreakdown.sort((a, b) => b.value - a.value)[0];
    return {
      text: `You have spent $${analytics.totalShare.toFixed(2)} total. Top category: ${topCategory ? topCategory.name : 'None'}.`,
      type: 'chart-spending',
      data: analytics.categoryBreakdown
    };
  }
}
