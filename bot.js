import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { schedule } from 'node-cron';

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROUP_CHAT_ID = process.env.GROUP_CHAT_ID; // keep as string!

if (!BOT_TOKEN || !GROUP_CHAT_ID) {
  throw new Error('Missing BOT_TOKEN or GROUP_CHAT_ID in environment variables.');
}

const bot = new Telegraf(BOT_TOKEN);

// 🔥 Special user ranks (the unplugged leaders)
const specialUsers = {
  'TheLastShedded': 'DEV-G',
  'Ian00Simo': 'G',
  'S3XXX_TC': 'Messenger G',
  'JuanDon617': 'G',
  'Infravibra': 'G',
  'Wolfontop22': 'G',
  'Flexlikejoshua': 'Lead G',
  'ReedAura': 'Messenger G',
  'DrNeoCortex8': 'G',
};

// 🚫 Known jokers / NPC accounts to block
const bannedUsers = ['joker_username_here', 'npc_bot1', 'npc_bot2'];

// Helper to send message by chat ID
async function sendMessage(chatId, text) {
  try {
    await bot.telegram.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  } catch (error) {
    if (
      error.response &&
      error.response.parameters &&
      error.response.parameters.migrate_to_chat_id
    ) {
      const newChatId = error.response.parameters.migrate_to_chat_id;
      console.log(`Chat ${chatId} migrated. Retrying with new chat id: ${newChatId}`);
      await bot.telegram.sendMessage(newChatId, text, { parse_mode: 'Markdown' });
    } else {
      console.error(`Error sending message to chat ${chatId}:`, error);
    }
  }
}

// Middleware: block banned users
bot.on('message', async (ctx, next) => {
  const username = ctx.from?.username;
  if (bannedUsers.includes(username)) {
    try {
      await ctx.deleteMessage();
      await sendMessage(ctx.chat.id.toString(), `🚫 @${username}, your clown act is over. This chat is for the unplugged only.`);
    } catch {}
    return; // stop processing banned user messages
  }
  return next(); // proceed for others
});

// Welcome message for new members
bot.on('new_chat_members', async (ctx) => {
  const newMembers = ctx.message.new_chat_members;
  const chatId = ctx.chat.id.toString();

  for (const member of newMembers) {
    const username = member.username ? `@${member.username}` : 'Top G';
    const rank = specialUsers[member.username] || null;

    const message = rank
      ? `🔥 Welcome ${username}. You’re not just a member — you’re *${rank}*. One of the first to take the unplug pill and step beyond the Matrix.\n\nThis isn’t a soft Telegram. This is your battlefield. You’re among the saved — but only those who prove their worth will rise like Andrew Tate’s true students.\n\nNow lead. Stoke the fire. Your empire awaits. Together, we watch the world burn. 🔥`
      : `🔥 ${username}, you’ve taken the first step by joining the Unplugged. Nobody here is still trapped in the Matrix — but to truly be saved like Top G’s students, you must *prove* your worth.\n\nSpeak boldly. Build wealth. Fight the system. The fire is lit. Together, we watch the world burn. 🔥`;

    await sendMessage(chatId, message);
  }
});

// Scheduled motivational message every 6 hours
schedule('0 */6 * * *', async () => {
  await sendMessage(
    GROUP_CHAT_ID,
    '🔥 Remember, you escaped the Matrix. The world burns soon, but you hold the flame. Stay ready, & mastermind.'
  );
});

// Daily Andrew Tate style broadcast at noon
schedule('0 12 * * *', async () => {
  const message =
`🔥 Listen up, Unplugged.

You didn’t unplug to listen to jokers and NPCs. You paid to rise above. To act. To lead.  
This world won’t wait for you to catch up — it will crush those who hesitate.

If you’re here, PROVE you deserve it. Build, hustle, fight. Or get unplugged again.

The match is lit. The world burns — you either watch, or you fan the flame.
`;
  await sendMessage(GROUP_CHAT_ID, message);
});

// Command to check rank/status
bot.command('rank', (ctx) => {
  const username = ctx.from?.username;
  if (!username) return ctx.reply('You need a Telegram username to check your rank.');

  const rank = specialUsers[username];
  if (rank) {
    ctx.reply(`🔥 @${username}, your rank is *${rank}*. You are one of the chosen unplugged warriors.`);
  } else {
    ctx.reply(`@${username}, you are not yet recognized as unplugged. Prove your worth and rise.`);
  }
});

// Engagement mission drop command (only by TheLastShedded)
bot.command('mission', async (ctx) => {
  const fromUsername = ctx.from?.username;

  if (fromUsername === 'TheLastShedded') {
    await sendMessage(
      GROUP_CHAT_ID,
      `🧠 MISSION DROP

Listen up. There’s no reason to pour millions into a coin or burn tokens if the holders are a bunch of losers still stuck in the Matrix.  

If you want this to move, PROVE you deserve it. Step up. Help others unplug. Build real value. Show you’re not just here to waste time.

In the next 6 hours, every Unplugged soldier must post ONE of these:  
- A recent WIN — something you earned, not luck  
- A clear plan to stack, scale, and multiply your bag  
- A real effort to lead, teach, and build the brotherhood  

If you believe someone else deserves to unplug — *help them*. Lead them. Don’t wait.  
Send them into the fire: https://burntheworld.vercel.app/

This is your chance to show you’re not a clown or an NPC. You were saved from the Matrix for a reason. Don’t waste the signal.

If you want to truly join the Top G students and be part of the next level, join Andrew’s school - jointherealworld. No excuses.

Top Gs don’t wait. They dominate.
`
    );
  } else {
    await sendMessage(ctx.chat.id.toString(), '❌ You are not authorized to issue missions.');
  }
});

// Log incoming message chat IDs for debugging
bot.on('message', (ctx) => {
  console.log('📣 Chat ID is:', ctx.chat.id);
});

// Launch bot
bot.launch();
console.log('🔥 Bot is live');

// Graceful shutdown handlers
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
