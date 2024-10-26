// Required dependencies
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// Initialize Express
const app = express();
app.use(express.json());

// Store user tasks and reminders (in memory - consider using a database for production)
const tasks = new Map();
const reminders = new Map();

// Start the bot

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.BOT_TOKEN);

// Discord bot commands
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    const args = message.content.trim().split(/ +/);
    const command = args[0].toLowerCase();

    switch(command) {
        case '!task':
            handleTask(message, args);
            break;
        case '!list':
            listTasks(message);
            break;
        case '!complete':
            completeTask(message, args);
            break;
        case '!remind':
            setReminder(message, args);
            break;
        case '!timer':
            startPomodoro(message, args);
            break;
        case '!help':
            showHelp(message);
            break;
    }
});

// Handle adding new tasks
async function handleTask(message, args) {
    if (args.length < 2) {
        message.reply('Please provide a task description: !task <description>');
        return;
    }

    const taskDescription = args.slice(1).join(' ');
    const userId = message.author.id;

    if (!tasks.has(userId)) {
        tasks.set(userId, []);
    }

    const userTasks = tasks.get(userId);
    userTasks.push({
        id: userTasks.length + 1,
        description: taskDescription,
        timestamp: new Date(),
        completed: false
    });

    const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Task Added')
        .setDescription(`Task: ${taskDescription}`)
        .setFooter({ text: `Task #${userTasks.length}` });

    message.reply({ embeds: [embed] });
}

// List all tasks
async function listTasks(message) {
    const userId = message.author.id;
    const userTasks = tasks.get(userId) || [];

    if (userTasks.length === 0) {
        message.reply('You have no tasks.');
        return;
    }

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Your Tasks')
        .setDescription(
            userTasks.map(task => 
                `${task.completed ? '✅' : '⬜'} ${task.id}. ${task.description}`
            ).join('\n')
        );

    message.reply({ embeds: [embed] });
}

// Mark task as complete
async function completeTask(message, args) {
    if (args.length < 2) {
        message.reply('Please specify a task ID: !complete <task_id>');
        return;
    }

    const userId = message.author.id;
    const taskId = parseInt(args[1]);
    const userTasks = tasks.get(userId);

    if (!userTasks) {
        message.reply('You have no tasks.');
        return;
    }

    const task = userTasks.find(t => t.id === taskId);
    if (!task) {
        message.reply('Task not found.');
        return;
    }

    task.completed = true;
    message.reply(`Task #${taskId} marked as complete! 🎉`);
}

// Set a reminder
async function setReminder(message, args) {
    if (args.length < 3) {
        message.reply('Please use format: !remind <minutes> <reminder_text>');
        return;
    }

    const minutes = parseInt(args[1]);
    const reminderText = args.slice(2).join(' ');

    setTimeout(() => {
        message.reply(`⏰ Reminder: ${reminderText}`);
    }, minutes * 60000);

    message.reply(`Reminder set for ${minutes} minutes from now!`);
}

// Start a Pomodoro timer
async function startPomodoro(message, args) {
    const duration = args[1] ? parseInt(args[1]) : 25; // Default 25 minutes

    message.reply(`Starting a ${duration}-minute Pomodoro timer! 🍅`);

    setTimeout(() => {
        message.reply(`⏰ Time's up! Your ${duration}-minute Pomodoro is complete! Take a break! 🎉`);
    }, duration * 60000);
}

// Help command
async function showHelp(message) {
    const embed = new EmbedBuilder()
        .setColor('#ff9900')
        .setTitle('Productivity Bot Commands')
        .setDescription('Here are all available commands:')
        .addFields(
            { name: '!task <description>', value: 'Add a new task' },
            { name: '!list', value: 'List all your tasks' },
            { name: '!complete <task_id>', value: 'Mark a task as complete' },
            { name: '!remind <minutes> <text>', value: 'Set a reminder' },
            { name: '!timer [minutes]', value: 'Start a Pomodoro timer (default 25 mins)' },
            { name: '!help', value: 'Show this help message' }
        );

    message.reply({ embeds: [embed] });
}

// Express routes for webhook integration
app.post('/webhook', (req, res) => {
    // Handle incoming webhooks
    res.status(200).json({ message: 'Webhook received' });
});

// Start the server and bot
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);