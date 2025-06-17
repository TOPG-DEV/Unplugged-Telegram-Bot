import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { schedule } from 'node-cron';

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROUP_CHAT_ID = process.env.GROUP_CHAT_ID;

if (!BOT_TOKEN || !GROUP_CHAT_ID) {
  throw new Error('Missing BOT_TOKEN or GROUP_CHAT_ID in environment variables.');
}

const bot = new Telegraf(BOT_TOKEN);

// Special user ranks
const specialUsers = {
  'TheLastShedded': 'DEV-G',
  'Ian00Simo': 'G',
  'S3XXX_TC': 'G',
  'JuanDon617': 'G',
  'Infravibra': 'G',
  'Wolfontop22': 'G',
  'Flexlikejoshua': 'Lead G',
  'ReedAura': 'Messenger G',
  'DrNeoCortex8': 'G',
};

// Welcome new chat members with rank-based messages
bot.on('new_chat_members', (ctx) => {
  const newMembers = ctx.message.new_chat_members;
  newMembers.forEach((member) => {
    const username = member.username ? `@${member.username}` : 'Top G';
    const rank = specialUsers[member.username] || null;

    const message = rank
      ? `🔥 Welcome ${username}. You're not just a member — you're *${rank}*. A chosen warrior. You escaped the Matrix while others still sleep.\n\nThis isn’t some soft, dead Telegram. You were saved for a reason. You made the right choice.\n\nNow it’s time to lead. Stoke the fire. Keep this chat alive with your voice, your war plan, and your mind. This is your empire — and together, we watch the world burn. 🔥`
      : `🔥 ${username}, only the real Top Gs make it this far. You’ve been chosen. The Unplugged is your battleground now.\n\nSpeak like a king. You are UNPLUGGED. The FIRE is lit — make your presence known. The world’s collapsing, and we’re the ones lighting the match. Together, we watch the world burn. 🔥`;

    ctx.reply(message, { parse_mode: 'Markdown' }).catch(console.error);
  });
});

// Scheduled motivational message every 6 hours
schedule('0 */6 * * *', () => {
  bot.telegram.sendMessage(
    GROUP_CHAT_ID,
    '🔥 Remember, you escaped the Matrix. The world burns soon, but you hold the flame. Stay ready, & mastermind.'
  ).catch(console.error);
});

// Engagement mission command - restricted to 'TheLastShedded'
bot.command('mission', (ctx) => {
  if (ctx.from.username === 'TheLastShedded') {
    bot.telegram.sendMessage(
      GROUP_CHAT_ID,
      `🧠 MISSION DROP\n\nThis isn’t a joke. This isn’t entertainment. This group will become the *greatest crypto war room on Telegram* — but only if you act.\n\nEvery Unplugged soldier must post ONE of the following in the next 6 hours:\n\n💰 A recent WIN\n📈 A PLAN to grow your bag\n📢 An effort to grow the brotherhood\n\nYou were saved from the Matrix. You were given the signal. Don’t waste it. Get rich. Build fire. Expand your network. Ignite the room.\n\nTop Gs don’t wait — they dominate.\n🔥 LET’S SEE WHO’S REAL. or be PLUGGED.`,
      { parse_mode: 'Markdown' }
    ).catch(console.error);
  } else {
    ctx.reply('❌ You are not authorized to issue missions.').catch(console.error);
  }
});

// Gracefully launch the bot with error handling
async function startBot() {
  try {
    await bot.launch();
    console.log('🔥 Bot started...');
  } catch (error) {
    console.error('❌ Failed to launch bot:', error);
    process.exit(1);
  }

  // Graceful shutdown handlers
  process.once('SIGINT', () => {
    console.log('SIGINT received, stopping bot...');
    bot.stop('SIGINT');
  });
  process.once('SIGTERM', () => {
    console.log('SIGTERM received, stopping bot...');
    bot.stop('SIGTERM');
  });
}

startBot();
