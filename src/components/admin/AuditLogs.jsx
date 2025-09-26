
import React, { useState, useEffect, useCallback } from 'react';
import { getAuditLogs, getAuditStats } from '../../services/authService';
import { debounce } from 'lodash';

const useDebounce = (callback, delay) => {
  const debouncedFn = useCallback(
    debounce((...args) => callback(...args), delay),
    [delay] 
  );
  return debouncedFn;
};

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorLogs, setErrorLogs] = useState(null);
  const [errorStats, setErrorStats] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    resourceType: '',
    startDate: '',
    endDate: '',
    search: '',
  });

  const debouncedFetchAuditLogs = useDebounce(() => fetchAuditLogs(), 500);

  useEffect(() => {
    fetchAuditLogs();
  }, [page, limit]);

  useEffect(() => {
    debouncedFetchAuditLogs();
    return () => debouncedFetchAuditLogs.cancel();
  }, [filters, debouncedFetchAuditLogs]);

  useEffect(() => {
    fetchAuditStats();
  }, []);

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    setErrorLogs(null);
    try {
      const response = await getAuditLogs({
        page,
        limit,
        ...filters,
      });
      if (response.success) {
        setLogs(response.data.auditLogs);
        setPagination(response.data.pagination);
      } else {
        setErrorLogs(response.message);
      }
    } catch (err) {
      setErrorLogs('Failed to fetch audit logs.');
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchAuditStats = async () => {
    setLoadingStats(true);
    setErrorStats(null);
    try {
      const response = await getAuditStats();
      if (response.success) {
        setStats(response.data.statistics);
      } else {
        setErrorStats(response.message);
      }
    } catch (err) {
      setErrorStats('Failed to fetch audit statistics.');
      console.error('Error fetching audit stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1); 
  };

  if (loadingLogs || loadingStats) return <div className="text-center py-4">Loading audit data...</div>;
  if (errorLogs) return <div className="text-center py-4 text-red-600">Error fetching logs: {errorLogs}</div>;
  if (errorStats) return <div className="text-center py-4 text-red-600">Error fetching stats: {errorStats}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Audit Logs</h2>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-blue-600">Total Logs</p>
            <p className="text-2xl font-bold text-blue-800">{stats.totalLogs}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-green-600">Logs Last 24h</p>
            <p className="text-2xl font-bold text-green-800">{stats.logsLast24Hours}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-red-600">Failed Operations</p>
            <p className="text-2xl font-bold text-red-800">{stats.failedOperations}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-purple-600">Unique Users</p>
            <p className="text-2xl font-bold text-purple-800">{stats.uniqueUsers}</p>
          </div>
        </div>
      )}

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          name="search"
          placeholder="Search logs..."
          className="p-2 border border-gray-300 rounded-md w-full"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="userId"
          placeholder="Filter by User ID..."
          className="p-2 border border-gray-300 rounded-md w-full"
          value={filters.userId}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="action"
          placeholder="Filter by Action..."
          className="p-2 border border-gray-300 rounded-md w-full"
          value={filters.action}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="resourceType"
          placeholder="Filter by Resource Type..."
          className="p-2 border border-gray-300 rounded-md w-full"
          value={filters.resourceType}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="startDate"
          className="p-2 border border-gray-300 rounded-md w-full"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          className="p-2 border border-gray-300 rounded-md w-full"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
        <select
          className="p-2 border border-gray-300 rounded-md w-full"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.userEmail} ({log.userId})</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.action}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.resourceType} {log.resourceId ? `(${log.resourceId})` : ''}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ipAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.httpMethod} {log.endpoint}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log.responseStatus >= 200 && log.responseStatus < 300 ? 'bg-green-100 text-green-800' :
                      log.responseStatus >= 400 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {log.responseStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{log.errorMessage || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage(page - 1)}
          disabled={!pagination.hasPrev}
          className="px-4 py-2 border rounded-md text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!pagination.hasNext}
          className="px-4 py-2 border rounded-md text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AuditLogs;
