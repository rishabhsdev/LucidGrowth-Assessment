// MongoDB initialization script for Email Analyzer
db = db.getSiblingDB('email-analyzer');

// Create collections
db.createCollection('emails');
db.createCollection('emailanalyses');

// Create indexes for better performance
db.emails.createIndex({ "messageId": 1 }, { unique: true });
db.emails.createIndex({ "isTestEmail": 1 });
db.emails.createIndex({ "isProcessed": 1 });
db.emails.createIndex({ "receivedAt": -1 });

db.emailanalyses.createIndex({ "emailId": 1 });
db.emailanalyses.createIndex({ "messageId": 1 });
db.emailanalyses.createIndex({ "analyzedAt": -1 });

print('✅ Email Analyzer database initialized successfully');
print('📧 Collections created: emails, emailanalyses');
print('🔍 Indexes created for optimal performance');
