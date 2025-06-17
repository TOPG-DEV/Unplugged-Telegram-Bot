import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { schedule } from 'node-cron';
// import { getLastTweetId, setLastTweetId } from './tweetTracker.js';
import Parser from 'rss-parser';

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROUP_CHAT_ID = process.env.GROUP_CHAT_ID;

if (!BOT_TOKEN || !GROUP_CHAT_ID) {
  throw new Error('Missing BOT_TOKEN or GROUP_CHAT_ID in environment variables.');
}

const bot = new Telegraf(BOT_TOKEN);
const parser = new Parser();

// 🔥 Special user ranks
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

// let lastTweetId = getLastTweetId();

// 🔁 Check for new tweets every 15 minutes
// async function checkTateTweets() {
//   try {
//     const feed = await parser.parseURL('https://nitter.poast.org/Cobratate/rss');
//     const latest = feed.items[0];

//     if (latest && latest.id !== lastTweetId) {
//       lastTweetId = latest.id;
//       setLastTweetId(latest.id);

//       const twitterLink = `https://x.com/Cobratate/status/${latest.id}`;

//       await bot.telegram.sendMessage(
//         GROUP_CHAT_ID,
//         `🧠 NEW TATE DROP\n${latest.title}\n${twitterLink}`
//       );
//     }

//   } catch (err) {
//     console.error('Tweet check failed:', err.message);
//   }
// }

// schedule('*/15 * * * *', checkTateTweets);

// 🔥 Welcome message for new members
bot.on('new_chat_members', (ctx) => {
  const newMembers = ctx.message.new_chat_members;
  newMembers.forEach((member) => {
    const username = member.username ? `@${member.username}` : 'Top G';
    const rank = specialUsers[member.username] || null;

    const message = rank
      ? `🔥 Welcome ${username}. You're not just a member — you're *${rank}*. A chosen warrior. You escaped the Matrix while others still sleep.\n\nThis isn’t some soft, dead Telegram. You were saved for a reason. You made the right choice.\n\nNow it’s time to lead. Stoke the fire. Keep this chat alive with your voice, your war plan, and your mind. This is your empire — and together, we watch the world burn. 🔥`
      : `🔥 ${username}, only the real Top Gs make it this far. You’ve been chosen. The Unplugged is your battleground now.\n\nSpeak like a king. you are UNPLUGGED. The FIRE is lit — make your presence known. The world’s collapsing, and we’re the ones lighting the match. Together, we watch the world burn. 🔥`;
    ctx.reply(message);
  });
});

// 🔥 Scheduled motivational message every 6 hours
schedule('0 */6 * * *', () => {
  bot.telegram.sendMessage(
    GROUP_CHAT_ID,
    '🔥 Remember, you escaped the Matrix. The world burns soon, but you hold the flame. Stay ready, & mastermind.'
  );
});

// ⚔️ Engagement mission drop command
bot.command('mission', (ctx) => {
  if (ctx.from.username === 'TheLastShedded') {
    bot.telegram.sendMessage(
      GROUP_CHAT_ID,
      `🧠 MISSION DROP\n\nThis isn’t a joke. This isn’t entertainment. This group will become the *greatest crypto war room on Telegram* — but only if you act.\n\nEvery Unplugged soldier must post ONE of the following in the next 6 hours:\n\n💰 A recent WIN\n📈 A PLAN to grow your bag\n📢 An effort to grow the brotherhood\n\nYou were saved from the Matrix. You were given the signal. Don’t waste it. Get rich. Build fire. Expand your network. Ignite the room.\n\nTop Gs don’t wait — they dominate.\n🔥 LET’S SEE WHO’S REAL. or be PLUGGED.`
    );
  } else {
    ctx.reply('❌ You are not authorized to issue missions.');
  }
});

// 🔐 Airdrop alert command (only for TheLastShedded)
// bot.command('alert', (ctx) => {
//   if (ctx.from.username === 'TheLastShedded') {
//     ctx.reply('🔥 ALERT: The airdrop window opens soon. Stay sharp. Eyes on the mission.');
//   } else {
//     ctx.reply('❌ You are not authorized to use this command.');
//   }
// });

// 🚀 Launch bot
bot.launch().then(() => {
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
  console.log('🔥 Bot started...');
}).catch((err) => {
  console.error('❌ Failed to launch bot:', err);
});

