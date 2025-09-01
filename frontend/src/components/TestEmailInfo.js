import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Mail, 
  AlertCircle, 
  Info, 
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TestEmailInfo = () => {
  const [testInfo, setTestInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    fetchTestInfo();
  }, []);

  const fetchTestInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/emails/test-info');
      setTestInfo(response.data.data);
    } catch (error) {
      console.error('Error fetching test info:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="btn-secondary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Email Instructions</h1>
          <p className="text-gray-600">Follow these steps to test the email analysis system</p>
        </div>
      </div>

      {/* Test Email Details */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Test?</h2>
          <p className="text-gray-600">Use the information below to send a test email</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Mail className="w-5 h-5 text-primary-600" />
              <span>Send Email To:</span>
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <code className="text-primary-700 font-mono text-sm break-all block mb-3">
                {testInfo?.testEmail || 'Loading...'}
              </code>
              <button
                onClick={() => copyToClipboard(testInfo?.testEmail, 'email')}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {copiedField === 'email' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Email Address</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Info className="w-5 h-5 text-primary-600" />
              <span>Subject Line:</span>
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <code className="text-primary-700 font-mono text-sm break-all block mb-3">
                {testInfo?.testSubject || 'Loading...'}
              </code>
              <button
                onClick={() => copyToClipboard(testInfo?.testSubject, 'subject')}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {copiedField === 'subject' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Subject Line</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Step-by-Step Instructions */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Instructions</h2>
        
        <div className="space-y-6">
          {testInfo?.instructions?.map((instruction, index) => (
            <motion.div
              key={index}
              className="flex items-start space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-700 text-lg">{instruction}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* What Happens Next */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Received</h3>
            <p className="text-gray-600 text-sm">The system automatically detects your test email via IMAP</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Analysis Processed</h3>
            <p className="text-gray-600 text-sm">Headers are analyzed to extract receiving chain and ESP type</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Results Available</h3>
            <p className="text-gray-600 text-sm">View detailed analysis results on the dashboard</p>
          </div>
        </div>
      </motion.div>

      {/* Tips and Notes */}
      <motion.div 
        className="card bg-blue-50 border-blue-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-blue-900 mb-4">💡 Tips & Notes</h2>
        
        <div className="space-y-3 text-blue-800">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>Make sure to use the exact subject line provided - this helps the system identify your test email</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>The system checks for new emails every 30 seconds, so results may take a moment to appear</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>You can send multiple test emails - each will be analyzed independently</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>Check the dashboard to see real-time updates and analysis results</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Link to="/" className="btn-primary text-center">
          Go to Dashboard
        </Link>
        <Link to="/emails" className="btn-secondary text-center">
          View All Emails
        </Link>
      </motion.div>
    </div>
  );
};

export default TestEmailInfo;
