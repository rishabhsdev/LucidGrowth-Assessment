import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Mail, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Trash2,
  RefreshCw,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

const EmailList = () => {
  const [emails, setEmails] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const [emailsRes, analysesRes] = await Promise.all([
        axios.get('/api/emails'),
        axios.get('/api/emails/analyses')
      ]);

      setEmails(emailsRes.data.data);
      setAnalyses(analysesRes.data.data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchEmails();
    setRefreshing(false);
  };

  const deleteEmail = async (id) => {
    if (window.confirm('Are you sure you want to delete this email?')) {
      try {
        await axios.delete(`/api/emails/${id}`);
        await fetchEmails();
      } catch (error) {
        console.error('Error deleting email:', error);
      }
    }
  };

  const getAnalysisForEmail = (emailId) => {
    return analyses.find(analysis => analysis.emailId === emailId);
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.from.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterType === 'test') {
      matchesFilter = email.isTestEmail;
    } else if (filterType === 'processed') {
      matchesFilter = email.isProcessed;
    } else if (filterType === 'unprocessed') {
      matchesFilter = !email.isProcessed;
    }

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email List</h1>
          <p className="text-gray-600">View and manage all processed emails</p>
        </div>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="btn-secondary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search emails by subject or sender..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="lg:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Emails</option>
              <option value="test">Test Emails</option>
              <option value="processed">Processed</option>
              <option value="unprocessed">Unprocessed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Email Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredEmails.length} of {emails.length} emails
      </div>

      {/* Email List */}
      {filteredEmails.length === 0 ? (
        <div className="card text-center py-12">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No emails found</p>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEmails.map((email) => {
            const analysis = getAnalysisForEmail(email._id);
            return (
              <motion.div
                key={email._id}
                className="card hover:shadow-md transition-shadow duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{email.subject}</h3>
                        <p className="text-sm text-gray-600">From: {email.from}</p>
                        <p className="text-sm text-gray-600">To: {email.to}</p>
                        
                        <div className="flex items-center space-x-4 mt-3">
                          {/* Status */}
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

                          {/* Test Email Badge */}
                          {email.isTestEmail && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Test Email
                            </span>
                          )}

                          {/* ESP Type */}
                          {analysis && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {analysis.espType}
                            </span>
                          )}

                          {/* Date */}
                          <span className="text-sm text-gray-500">
                            {email.receivedAt ? format(new Date(email.receivedAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/emails/${email._id}`}
                      className="btn-secondary text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Link>
                    <button
                      onClick={() => deleteEmail(email._id)}
                      className="btn-secondary text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Analysis Preview */}
                {analysis && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Receiving Chain</h4>
                        <div className="text-sm text-gray-600">
                          {analysis.receivingChain.length > 0 ? (
                            <span>{analysis.receivingChain.length} servers in chain</span>
                          ) : (
                            <span className="text-gray-400">No chain data</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">ESP Detection</h4>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{analysis.espType}</span>
                          {analysis.espConfidence && (
                            <span className="text-gray-500 ml-2">({analysis.espConfidence}% confidence)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmailList;
