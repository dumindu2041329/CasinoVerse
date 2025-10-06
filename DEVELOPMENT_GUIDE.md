# 🚀 CasinoVerse Development Guide

## Project Overview

CasinoVerse is a comprehensive frontend casino platform featuring 7 casino games, user authentication, wallet management, and provably fair gaming mechanics.

## Architecture

### Context API State Management

#### AuthContext
Manages user authentication and session:
- User registration
- User login
- User logout
- Session persistence via localStorage
- Protected route authentication

#### WalletContext
Manages user balance and transactions:
- Balance tracking
- Deposit functionality
- Withdrawal functionality
- Bet placement
- Winnings distribution
- Transaction history

### Provably Fair System

All games use a deterministic RNG system:

```typescript
const clientSeed = generateClientSeed();  // Browser-generated
const serverSeed = generateServerSeed();  // Server-simulated
const nonce = uniqueNumber;               // Game round identifier

const result = generateRandomNumber(clientSeed, serverSeed, nonce, min, max);
```

This ensures:
- Transparency
- Verifiability
- Fairness
- No server manipulation

## Game Implementation Details

### 1. Mines

**File**: `src/pages/games/Mines.tsx`

**Logic**:
- Generate mine positions using provably fair RNG
- Track revealed tiles in Set
- Calculate progressive multiplier based on reveals
- Instant loss on mine hit
- Manual cashout or auto-win on all safe tiles revealed

**Key Functions**:
- `calculateMultiplier()`: Progressive payout calculation
- `startGame()`: Initialize game state and mine positions
- `revealTile()`: Handle tile clicks and win/loss logic
- `cashout()`: Distribute winnings

### 2. Dice

**File**: `src/pages/games/Dice.tsx`

**Logic**:
- User sets target number (1-99)
- Choose prediction (over/under)
- Roll generates random 0-100
- Compare result with target and prediction
- Multiplier = 98 / win_chance

**Formula**:
```typescript
chance = prediction === 'over' ? (100 - target) : target
multiplier = 98 / chance
```

### 3. Plinko

**File**: `src/pages/games/Plinko.tsx`

**Logic**:
- Ball drops through pegs (simulated)
- Lands in one of 9 slots
- Each slot has multiplier based on risk level
- Low risk: safer multipliers (0.9x - 1.5x)
- High risk: volatile multipliers (0.2x - 10x)

### 4. Limbo

**File**: `src/pages/games/Limbo.tsx`

**Logic**:
- User sets target multiplier
- Generate result multiplier (1.00x to 1,000,000x)
- Win if result >= target
- Payout = bet * target_multiplier

**Formula**:
```typescript
result = 1.0 / (1.0 - random * 0.99)
win_chance = 98 / target_multiplier
```

### 5. Keno

**File**: `src/pages/games/Keno.tsx`

**Logic**:
- Player selects up to 10 numbers (1-40)
- Draw 10 random numbers
- Count matches
- Payout based on matches and numbers picked
- Uses payout table for multipliers

**Payout Table**:
- More picks = higher potential multipliers
- More matches = higher payouts
- Example: 10 picks, 10 matches = 1000x

### 6. Crash

**File**: `src/pages/games/Crash.tsx`

**Logic**:
- Generate crash point using RNG
- Multiplier increases from 1.00x at 0.5x per second
- Player must cashout before crash
- Real-time updates via setInterval
- Auto-loss if not cashed out

**Key Features**:
- Live multiplier animation
- Manual cashout
- Provably fair crash point
- Real-time UI updates

### 7. Roulette

**File**: `src/pages/games/Roulette.tsx`

**Logic**:
- European (0-36) or American (0-37) variant
- Multiple bet types:
  - Number: 36x payout
  - Red/Black: 2x payout
  - Even/Odd: 2x payout
  - Low/High: 2x payout
- Support for multiple simultaneous bets
- Total winnings calculated across all winning bets

## Data Flow

### User Registration Flow
```
Register Page → AuthContext.register() 
  → Validate input
  → Store user in localStorage
  → Set authenticated state
  → Navigate to home
```

### Game Play Flow
```
Game Component → Place bet (WalletContext)
  → Generate provably fair result
  → Determine win/loss
  → Update balance (WalletContext)
  → Record transaction
  → Display result
```

### Wallet Flow
```
Wallet Modal → Deposit/Withdraw
  → Update balance
  → Create transaction record
  → Persist to localStorage
  → Update UI
```

## Local Storage Schema

### Users
```typescript
casinoUsers: Array<{
  id: string;
  username: string;
  email: string;
  password: string;  // In production: NEVER store plain text!
  balance: number;
  createdAt: Date;
}>
```

### Current User
```typescript
casinoUser: {
  id: string;
  username: string;
  email: string;
  balance: number;
  createdAt: Date;
}
```

### Wallet Data
```typescript
wallet_{userId}: {
  balance: number;
  transactions: Array<{
    id: string;
    type: 'deposit' | 'withdraw' | 'bet' | 'win';
    amount: number;
    timestamp: Date;
    game?: string;
  }>
}
```

## Styling System

### Tailwind Custom Classes

Defined in `src/index.css`:

```css
.btn-primary: Gold button style
.btn-secondary: Accent button style
.card: Casino-themed card container
.input-field: Styled input fields
```

### Color Scheme

Primary colors defined in `tailwind.config.js`:
- **primary**: Dark navy background
- **secondary**: Lighter navy for cards
- **accent**: Blue accent for interactions
- **gold**: Primary brand color
- **success**: Green for wins
- **danger**: Red for losses

## Key Components

### Layout
- Persistent header with navigation
- User info and wallet display
- Mobile-responsive menu
- Footer with disclaimers

### WalletModal
- Tabbed interface (Deposit/Withdraw/History)
- Quick amount buttons
- Transaction list with infinite scroll
- Real-time balance updates

### Game Components
All games share common patterns:
- Bet amount input
- Game-specific controls
- Result display area
- Message/feedback system
- Provably fair seed display

## Best Practices

### State Management
- Use Context for global state (auth, wallet)
- Use useState for component-local state
- Avoid prop drilling with Context

### Type Safety
- Define interfaces in `src/types/index.ts`
- Use TypeScript strict mode
- Type all props and state

### Performance
- Use React.memo for expensive renders
- Debounce user inputs where appropriate
- Clean up intervals/timeouts in useEffect

### Error Handling
- Validate all user inputs
- Show user-friendly error messages
- Prevent negative balances
- Handle edge cases

## Testing Checklist

### Authentication
- [ ] Register new user
- [ ] Login existing user
- [ ] Logout functionality
- [ ] Protected routes redirect
- [ ] Session persistence

### Wallet
- [ ] Deposit funds
- [ ] Withdraw funds
- [ ] Insufficient balance handling
- [ ] Transaction history display

### Games
For each game:
- [ ] Place valid bet
- [ ] Handle insufficient balance
- [ ] Win scenario
- [ ] Loss scenario
- [ ] Balance updates correctly
- [ ] Transaction recorded
- [ ] Provably fair seeds generated
- [ ] Mobile responsive

### UI/UX
- [ ] Responsive on mobile
- [ ] Animations work smoothly
- [ ] Buttons disabled when appropriate
- [ ] Loading states shown
- [ ] Error messages clear

## Production Considerations

### Backend Requirements
- REST API or GraphQL
- Database (PostgreSQL recommended)
- Authentication (JWT tokens)
- Password hashing (bcrypt)
- Transaction isolation
- Audit logging

### Security
- HTTPS only
- CORS configuration
- Rate limiting
- Input sanitization
- SQL injection prevention
- XSS protection

### Legal Requirements
- Gaming licenses
- Age verification (18+)
- KYC/AML compliance
- Terms of service
- Privacy policy
- Responsible gaming features

### Monitoring
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance monitoring
- User behavior tracking

## Deployment

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Environment Variables
For production, create `.env`:
```
VITE_API_URL=https://api.casinoverse.com
VITE_ENV=production
```

### Hosting Options
- Vercel (recommended for React)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## Troubleshooting

### Common Issues

**Balance not updating**
- Check WalletContext is properly wrapped
- Verify localStorage is available
- Check browser console for errors

**Games not loading**
- Verify routing in App.tsx
- Check authentication state
- Ensure game files are imported

**Styling issues**
- Run `npm run dev` to rebuild Tailwind
- Check Tailwind config paths
- Verify class names are correct

## Contributing

1. Follow existing code patterns
2. Maintain TypeScript type safety
3. Test all changes thoroughly
4. Keep components focused and reusable
5. Document complex logic with comments

## Support

For issues or questions:
1. Check this development guide
2. Review component code and comments
3. Test in isolation
4. Check browser console for errors

---

Happy coding! 🎰
