import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { schedule } from 'node-cron';
import { getLastTweetId, setLastTweetId } from './tweetTracker.js';
import Parser from 'rss-parser';

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROUP_CHAT_ID = process.env.GROUP_CHAT_ID;

if (!BOT_TOKEN || !GROUP_CHAT_ID) {
  throw new Error('Missing BOT_TOKEN or GROUP_CHAT_ID in environment variables.');
}

const bot = new Telegraf(BOT_TOKEN);
const parser = new Parser();

const specialUsers = [
  'Ian00Simo',
  'S3XXX_TC',
  'JuanDon617',
  'Infravibra',
  'Wolfontop22',
  'Flexlikejoshua',
  'ReedAura',
  'DrNeoCortex8',
];


let lastTweetId = getLastTweetId();


// 🔁 Check for new tweets every 3 minutes
async function checkTateTweets() {
  try {
    const feed = await parser.parseURL('https://nitter.poast.org/Cobratate/rss');
    const latest = feed.items[0];

    if (latest && latest.id !== lastTweetId) {
      lastTweetId = latest.id;
      setLastTweetId(latest.id); // <-- persist

      // Construct official Twitter link:
      const twitterLink = `https://x.com/Cobratate/status/${latest.id}`;

      await bot.telegram.sendMessage(
        GROUP_CHAT_ID,
        `🧠 NEW TATE DROP\n${latest.title}\n${twitterLink}`
      );
    }

  } catch (err) {
    console.error('Tweet check failed:', err.message);
  }
}


schedule('*/15 * * * *', checkTateTweets);

// 🔥 Welcome message for new members
bot.on('new_chat_members', (ctx) => {
  const newMembers = ctx.message.new_chat_members;
  newMembers.forEach((member) => {
    const username = member.username ? `@${member.username}` : 'Top G';
    const isSpecial = member.username && specialUsers.includes(member.username);
    
   const message = isSpecial
      ? `🔥 Welcome ${username}. You're not just a member — you're the elite. A chosen warrior. You escaped the Matrix when others stayed plugged in like sheep.\n\nThis isn’t some soft, dead Telegram group. You were saved for a reason. You made the right choice.\n\nNow it’s time to lead. Stoke the fire. Keep this chat alive with your mind, your energy, your war plans. This is your empire — and together, we watch the world burn. 🔥`
      : `🔥 ${username}, only the real Top Gs make it this far. You’ve been chosen. The Unplugged is your battleground now.\n\nSpeak like a king. Move like a wolf. The FIRE is lit — make your presence known. The world’s collapsing, and we’re the ones lighting the match.`;
    ctx.reply(message);
  });
});

// 🌅 Daily GM drop — every day at 8:00 AM
schedule('0 8 * * *', () => {
  bot.telegram.sendMessage(
    GROUP_CHAT_ID,
    `🌅 **GM! UNPLUGGED**\n\nYou weren’t meant to live soft. You weren’t built for silence. You’re here because you *escaped* while others stayed plugged in like bots.\n\n🔥 Today’s reminder:\nYou’re chosen. You're awake. And something massive is coming.\n\nDrop your GM. Let this room feel your presence.\nThe real Top Gs make noise before the world even opens its eyes.`
  );
});


// 🔥 Scheduled motivational message every 6 hours
schedule('0 */6 * * *', () => {
  bot.telegram.sendMessage(
    GROUP_CHAT_ID,
    '🔥 Remember, you escaped the Matrix. The world burns soon, but you hold the flame. Stay ready, & mastermind.'
  );
});

// 🔐 Airdrop alert command (only you can use it)
// bot.command('alert', (ctx) => {
//   if (ctx.from.username === 'TheLastShedded') {
//     ctx.reply('🔥 ALERT: The airdrop window opens soon. Stay vigilant.');
//   } else {
//     ctx.reply('❌ You are not authorized to use this command.');
//   }
// });

// 🚀 Launch bot
bot.launch();
console.log('🔥 Bot started...');
