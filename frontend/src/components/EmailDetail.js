import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Mail, 
  Server, 
  Globe, 
  Clock, 
  User,
  FileText,
  BarChart3,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

const EmailDetail = () => {
  const { id } = useParams();
  const [email, setEmail] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchEmailDetails();
  }, [id]);

  const fetchEmailDetails = async () => {
    try {
      setLoading(true);
      const [emailRes, analysisRes] = await Promise.all([
        axios.get(`/api/emails/${id}`),
        axios.get(`/api/emails/${id}/analysis`)
      ]);

      setEmail(emailRes.data.data);
      setAnalysis(analysisRes.data.data);
    } catch (error) {
      console.error('Error fetching email details:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchEmailDetails();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Email not found</p>
        <Link to="/emails" className="btn-primary mt-4">Back to Email List</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/emails" className="btn-secondary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Email List
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{email.subject}</h1>
          <p className="text-gray-600">Email Analysis Details</p>
        </div>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Email Overview */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-primary-600" />
              Email Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">From:</label>
                <p className="text-gray-900">{email.from}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">To:</label>
                <p className="text-gray-900">{email.to}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Subject:</label>
                <p className="text-gray-900">{email.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date:</label>
                <p className="text-gray-900">
                  {email.date ? format(new Date(email.date), 'MMM dd, yyyy HH:mm:ss') : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Received:</label>
                <p className="text-gray-900">
                  {email.receivedAt ? format(new Date(email.receivedAt), 'MMM dd, yyyy HH:mm:ss') : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  email.isProcessed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {email.isProcessed ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Processed
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Test Email Badge */}
            {email.isTestEmail && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Test Email
                </span>
              </div>
            )}
          </motion.div>

          {/* ESP Analysis */}
          {analysis && (
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
                ESP Analysis
              </h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Detected ESP Type</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{analysis.espType}</div>
                    {analysis.espConfidence && (
                      <div className="text-sm text-gray-600">
                        Confidence: {analysis.espConfidence}%
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Detection Indicators</h3>
                    <div className="space-y-2">
                      {analysis.espIndicators?.map((indicator, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Metadata */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{analysis.analysisMetadata?.processingTime || 0}ms</div>
                  <div className="text-sm text-gray-600">Processing Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{analysis.analysisMetadata?.headerCount || 0}</div>
                  <div className="text-sm text-gray-600">Headers Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{analysis.analysisMetadata?.chainLength || 0}</div>
                  <div className="text-sm text-gray-600">Chain Length</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Receiving Chain Visualization */}
          {analysis && analysis.receivingChain && analysis.receivingChain.length > 0 && (
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Server className="w-5 h-5 mr-2 text-primary-600" />
                Receiving Chain
              </h2>
              
              <div className="space-y-4">
                {analysis.receivingChain.map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    {/* Step Number */}
                    <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Server:</label>
                          <p className="text-gray-900 font-mono text-sm">{step.server}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Protocol:</label>
                          <p className="text-gray-900 font-mono text-sm">{step.protocol}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">HELO:</label>
                          <p className="text-gray-900 font-mono text-sm">{step.helo}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">IP:</label>
                          <p className="text-gray-900 font-mono text-sm">{step.ip}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    {index < analysis.receivingChain.length - 1 && (
                      <div className="flex items-center justify-center w-8">
                        <div className="w-0.5 h-8 bg-gray-300"></div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Email Content */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-600" />
              Email Content
            </h2>
            
            {email.text && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Plain Text</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">{email.text}</pre>
                </div>
              </div>
            )}
            
            {email.html && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">HTML Content</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div 
                    className="text-sm text-gray-700"
                    dangerouslySetInnerHTML={{ __html: email.html }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/emails" className="btn-secondary w-full justify-center">
                View All Emails
              </Link>
              <Link to="/" className="btn-primary w-full justify-center">
                Go to Dashboard
              </Link>
            </div>
          </motion.div>

          {/* Email Stats */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Message ID:</span>
                <span className="text-gray-900 font-mono text-xs truncate max-w-32">
                  {email.messageId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Headers Count:</span>
                <span className="text-gray-900">
                  {email.headers ? Object.keys(email.headers).length : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Analysis Date:</span>
                <span className="text-gray-900 text-sm">
                  {analysis?.analyzedAt ? format(new Date(analysis.analyzedAt), 'MMM dd, yyyy') : 'N/A'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Raw Headers Preview */}
          {email.headers && (
            <motion.div 
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw Headers Preview</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(email.headers).slice(0, 10).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <span className="text-gray-600 ml-2 font-mono break-all">
                      {Array.isArray(value) ? value.join(', ') : value}
                    </span>
                  </div>
                ))}
                {Object.keys(email.headers).length > 10 && (
                  <div className="text-xs text-gray-500 italic">
                    ... and {Object.keys(email.headers).length - 10} more headers
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
