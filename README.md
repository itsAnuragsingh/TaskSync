# TaskSync

TaskSync is a powerful Discord bot designed to supercharge productivity by managing tasks, setting reminders, and facilitating the Pomodoro technique. It also includes webhook integration for expanded functionality and team collaboration.

## Features

- Task Management: Add, list, and complete tasks with ease
- Reminders: Set timed reminders for important events or deadlines
- Pomodoro Timer: Start customizable Pomodoro sessions to boost focus
- Webhook Integration: Receive external data through a webhook endpoint for seamless integration with other tools

## Commands

- `!task <description>`: Add a new task to your list
- `!list`: Display all your current tasks
- `!complete <task_id>`: Mark a specific task as complete
- `!remind <minutes> <text>`: Set a reminder for a future time
- `!timer [minutes]`: Start a Pomodoro timer (default is 25 minutes)
- `!help`: Show a help message with all available commands

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/TaskSync.git
   cd TaskSync
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   BOT_TOKEN=your_discord_bot_token
   PORT=3000
   ```

4. Start the bot:
   ```
   npm start
   ```

## Contributing

We welcome contributions to TaskSync! If you have ideas for new features or improvements, please feel free to submit a Pull Request or open an Issue.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Support

If you encounter any issues or have questions about TaskSync, please open an issue on the GitHub repository or contact the maintainer.

Happy productivity boosting with TaskSync!
