# Email Analyzer - IMAP Email Analysis Tool

A comprehensive full-stack application that automatically identifies the receiving chain and ESP type of emails using IMAP technology. Built with React.js frontend, Node.js with NestJS backend, and MongoDB database.

## 🚀 Features

- **IMAP Email Processing**: Automatically fetches and processes incoming emails
- **Receiving Chain Analysis**: Extracts and visualizes the server path emails travel through
- **ESP Type Detection**: Identifies Email Service Providers (Gmail, Outlook, Amazon SES, etc.)
- **Real-time Monitoring**: Dashboard with live updates and statistics
- **Responsive UI**: Modern, mobile-friendly interface built with React and Tailwind CSS
- **MongoDB Storage**: Persistent storage of email data and analysis results
- **RESTful API**: Clean backend architecture with NestJS framework

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React.js)    │◄──►│   (NestJS)      │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • IMAP Service  │    │ • Email Schema  │
│ • Email List    │    │ • Email API     │    │ • Analysis      │
│ • Test Info     │    │ • Analysis      │    │   Schema        │
│ • Responsive UI │    │   Engine        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **NestJS** - Progressive Node.js framework
- **Mongoose** - MongoDB object modeling
- **IMAP** - Email protocol library
- **Mailparser** - Email parsing library
- **Cron Jobs** - Scheduled email checking

### Database
- **MongoDB** - NoSQL document database

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or cloud instance)
- **IMAP Email Account** (Gmail, Outlook, etc.)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LucidGrowth-Assessment
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/email-analyzer

# IMAP Configuration
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your-email@gmail.com
IMAP_PASSWORD=your-app-password
```

**Note**: For Gmail, you'll need to:
1. Enable 2-Factor Authentication
2. Generate an App Password
3. Use the App Password instead of your regular password

### 4. Run with Docker Compose (recommended)

```bash
# Ensure Docker Desktop is running (Windows/macOS)
docker compose up --build
```

Services:
- MongoDB: `mongodb://admin:password@localhost:27017` (db `email-analyzer`)
- Backend API: http://localhost:3001
- Frontend UI: http://localhost:3000

If you see an error like `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.`, start Docker Desktop and re-run the command.

### 5. Run the Application

```bash
# Development mode (both frontend and backend)
npm run dev

# Or run separately:

# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## 📧 How to Use

### 1. Access the Dashboard

Open your browser and navigate to `http://localhost:3000`. You'll see the main dashboard with:
- Email statistics
- Test email instructions
- Recent analyses

### 2. Send a Test Email

1. **Copy the Test Email Address**: The dashboard displays a unique test email address
2. **Copy the Subject Line**: Use the exact subject line shown
3. **Send an Email**: From any email client, send an email to the test address with the specified subject

### 3. View Results

The system will automatically:
- Detect the incoming email via IMAP
- Process the email headers
- Extract the receiving chain
- Identify the ESP type
- Display results on the dashboard

### 4. Explore Email Details

- **Dashboard**: Overview of all emails and statistics
- **Email List**: Browse all processed emails with filtering
- **Email Detail**: View detailed analysis including receiving chain visualization

## 🔧 Configuration Options

### IMAP Settings

The system supports various IMAP providers:

```env
# Gmail
IMAP_HOST=imap.gmail.com
IMAP_PORT=993

# Outlook/Hotmail
IMAP_HOST=outlook.office365.com
IMAP_PORT=993

# Yahoo
IMAP_HOST=imap.mail.yahoo.com
IMAP_PORT=993

# Custom Server
IMAP_HOST=mail.yourdomain.com
IMAP_PORT=993
```

### Email Checking Frequency

The system checks for new emails every 30 seconds by default. You can modify this in `backend/src/email/imap.service.ts`:

```typescript
@Cron(CronExpression.EVERY_30_SECONDS)
async checkForNewEmails() {
  // ... email checking logic
}
```

## 📊 API Endpoints

### Email Management
- `GET /api/emails` - List all emails
- `GET /api/emails/:id` - Get email details
- `DELETE /api/emails/:id` - Delete email
- `GET /api/emails/stats` - Get email statistics

### Analysis
- `GET /api/emails/analyses` - List all analyses
- `GET /api/emails/:id/analysis` - Get email analysis
- `GET /api/emails/test/analyses` - Get test email analyses

### Test Information
- `GET /api/emails/test-info` - Get test email instructions

## 🎨 UI Components

### Dashboard
- **Statistics Cards**: Total emails, processed count, success rate
- **Test Email Info**: Current test email address and subject
- **Recent Analyses**: Latest test email results

### Email List
- **Search & Filter**: Find emails by content or status
- **Status Indicators**: Visual status badges for each email
- **Quick Actions**: View details or delete emails

### Email Detail
- **Email Overview**: Sender, recipient, dates, status
- **ESP Analysis**: Detected provider with confidence score
- **Receiving Chain**: Visual timeline of server hops
- **Raw Content**: Email body and headers

## 🔍 ESP Detection

The system identifies Email Service Providers by analyzing email headers:

- **Gmail**: `x-google-smtp-source`, `x-gm-message-state`
- **Outlook**: `x-ms-has-attach`, `x-ms-exchange-transport-fromentityheader`
- **Amazon SES**: `x-ses-receipt`, `x-ses-outgoing-token`
- **Zoho**: `x-zoho-virus-scanned`, `x-zoho-authenticated`
- **SendGrid**: `x-sg-eid`, `x-sendgrid`
- **Mailgun**: `x-mailgun-variables`, `x-mailgun-sending-ip`

## 🚀 Deployment

### Production Build

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

### Environment Variables

For production, set these environment variables:

```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
IMAP_HOST=your-imap-host
IMAP_USER=your-imap-user
IMAP_PASSWORD=your-imap-password
```

### Docker Deployment

```dockerfile
# Example Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

## 🧪 Testing

### Manual Testing

1. **Send Test Emails**: Use different email providers to test ESP detection
2. **Check IMAP Connection**: Verify connection to your email server
3. **Monitor Processing**: Watch real-time email processing in the dashboard

### API Testing

Use tools like Postman or curl to test the API endpoints:

```bash
# Test health endpoint
curl http://localhost:3001/health

# Get email statistics
curl http://localhost:3001/api/emails/stats

# Get test email info
curl http://localhost:3001/api/emails/test-info
```

## 🐛 Troubleshooting

### Common Issues

1. **IMAP Connection Failed**
   - Check email credentials
   - Verify IMAP settings
   - Ensure 2FA is enabled for Gmail

2. **MongoDB Connection Error**
   - Verify MongoDB is running
   - Check connection string
   - Ensure database exists

3. **Frontend Not Loading**
   - Check if backend is running
   - Verify proxy configuration
   - Check browser console for errors

### Debug Mode

Enable debug logging in the backend:

```typescript
// In main.ts
const app = await NestFactory.create(AppModule, {
  logger: ['error', 'warn', 'debug', 'log', 'verbose'],
});
```

## 📚 Additional Resources

- [IMAP Protocol Documentation](https://tools.ietf.org/html/rfc3501)
- [Email Headers Analysis](https://toolbox.googleapps.com/apps/messageheader/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://reactjs.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is built for the LucidGrowth Assessment. Please refer to the project requirements for usage guidelines.

## 🆘 Support

For technical support or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check the browser console and backend logs
4. Verify your configuration settings

---

**Built with ❤️ using React, Node.js, NestJS, and MongoDB**
