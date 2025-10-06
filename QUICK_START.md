# 🚀 Quick Start Guide - CasinoVerse

## Get Started in 3 Steps

### 1. Start Development Server
```bash
npm run dev
```
The app will open at: `http://localhost:5173`

### 2. Create an Account
- Click **"Register"** in the header
- Fill in:
  - Username: `testuser`
  - Email: `test@example.com`
  - Password: `password123`
- Click **"Create Account"**
- You'll get $1000 starting balance automatically! 💰

### 3. Play Games!
- Choose any game from the header menu
- Set your bet amount
- Play and watch your balance update in real-time

## 🎮 Game List

| Game | Description | Features |
|------|-------------|----------|
| 💣 **Mines** | Avoid mines in a 5x5 grid | Progressive multipliers, cashout anytime |
| 🎲 **Dice** | Roll over/under a target | Adjustable odds, up to 99x multiplier |
| 🎯 **Plinko** | Drop ball to win prizes | 3 risk levels, up to 10x multiplier |
| 📈 **Limbo** | Predict multiplier threshold | Up to 1,000,000x possible |
| 🎱 **Keno** | Pick numbers like lottery | Up to 1000x on 10 matches |
| ⚡ **Crash** | Cash out before crash | Real-time multiplier growth |
| 🎯 **Roulette** | Classic casino roulette | European & American variants |

## 💰 Wallet Management

### Add Funds
1. Click **wallet icon** in header
2. Click **"Deposit"** tab
3. Enter amount or use quick buttons ($10, $25, $50, etc.)
4. Click **"Deposit"**

### Withdraw
1. Click **wallet icon**
2. Click **"Withdraw"** tab  
3. Enter amount (must have sufficient balance)
4. Click **"Withdraw"**

### View History
- Click wallet icon
- Go to **"History"** tab
- See all deposits, withdrawals, bets, and wins

## 📱 Mobile Testing

The app is fully responsive! Test on:
- Desktop browser (Chrome, Firefox, Edge)
- Mobile browser (resize window or use DevTools)
- Tablet view

## 🎯 Test Scenarios

### Winning Scenario
1. Go to **Dice**
2. Set bet to $10
3. Set target to **50.00**
4. Choose **"Over"**
5. Click **"Roll Dice"**
6. You have 50% chance to win 2x!

### Mines Strategy
1. Go to **Mines**
2. Set bet to $10
3. Set mines to **3** (safer)
4. Click **"Start Game"**
5. Click tiles carefully
6. Cash out anytime to secure profit!

### Crash Excitement
1. Go to **Crash**
2. Set bet to $10
3. Click **"Start Game"**
4. Watch multiplier grow
5. Click **"Cash Out"** before it crashes!

## 🔍 Features to Explore

✅ **Provably Fair**: Each game shows seeds after completion  
✅ **Transaction History**: Track every bet and win  
✅ **Real-time Balance**: Updates instantly on every action  
✅ **Responsive Design**: Works on all screen sizes  
✅ **Multiple Accounts**: Create multiple test accounts  
✅ **No Backend Required**: Everything runs in your browser

## 🛠️ Available Commands

```bash
# Start dev server (hot reload enabled)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🎨 Customization

Want to change colors? Edit `tailwind.config.js`:
```javascript
colors: {
  casino: {
    gold: '#e94560',  // Change to your color!
  }
}
```

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Vite will auto-select next available port
# Or manually specify:
npm run dev -- --port 3000
```

**Can't see my balance?**
- Make sure you're logged in
- Check browser console for errors
- Try refreshing the page

**Game not loading?**
- Verify you're logged in
- Check URL is correct
- Clear browser cache

## 📚 Learn More

- **Full Documentation**: See `README.md`
- **Development Guide**: See `DEVELOPMENT_GUIDE.md`
- **Game Logic**: Check files in `src/pages/games/`
- **Types**: See `src/types/index.ts`

## 🎉 That's It!

You're ready to explore CasinoVerse! Have fun testing all 7 games.

---

**Remember**: This is a demo project. All balances are virtual and stored locally in your browser.
