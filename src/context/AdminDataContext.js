import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAllItems, getAllUsers, getAllOrders } from '../services/api';
import { useAuth } from './AuthContext';

const AdminDataContext = createContext(null);

export const useAdminData = () => {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider');
  return ctx;
};

export const AdminDataProvider = ({ children }) => {
  const { getToken, isAdmin } = useAuth();

  const [items, setItems] = useState(null);
  const [users, setUsers] = useState(null);
  const [orders, setOrders] = useState(null);
  // Additional admin data caches used by other tabs
  const [contacts, setContacts] = useState(null);
  const [inquiries, setInquiries] = useState(null);
  const [newsletters, setNewsletters] = useState(null);
  const [subscribers, setSubscribers] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [loadedAt, setLoadedAt] = useState(null);
  const STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes cache freshness

  // Load all admin-relevant data once
  useEffect(() => {
    let cancelled = false;
    const loadAll = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parallel fetches. Users and orders require admin token.
        const token = getToken?.();
        const canAdmin = isAdmin?.();

        const promises = [getAllItems()];
        if (token && canAdmin) {
          promises.push(getAllUsers(token));
          promises.push(getAllOrders(token));
        } else {
          promises.push(Promise.resolve([]));
          promises.push(Promise.resolve([]));
        }

        const [itemsRes, usersRes, ordersRes] = await Promise.all(promises);
        if (cancelled) return;

        setItems(itemsRes?.items || itemsRes || []);
        setUsers(Array.isArray(usersRes) ? usersRes : []);
        setOrders(Array.isArray(ordersRes) ? ordersRes : (ordersRes?.orders || []));
        setLoadedAt(Date.now());
      } catch (e) {
        if (cancelled) return;
        setError(e.message || 'Failed to load admin data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // Only load if nothing loaded or cache stale
    const isStale = !loadedAt || (Date.now() - loadedAt > STALE_TIME_MS);
    if (isStale) {
      loadAll();
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, []); // load once entering admin area

  const refresh = async () => {
    // manual refresh API if ever needed by UI
    try {
      setLoading(true);
      setError(null);
      const token = getToken?.();
      const canAdmin = isAdmin?.();
      const promises = [getAllItems()];
      if (token && canAdmin) {
        promises.push(getAllUsers(token));
        promises.push(getAllOrders(token));
      } else {
        promises.push(Promise.resolve([]));
      }
      const [itemsRes, usersRes, ordersRes] = await Promise.all(promises);
      setItems(itemsRes?.items || itemsRes || []);
      setUsers(Array.isArray(usersRes) ? usersRes : []);
      setOrders(Array.isArray(ordersRes) ? ordersRes : (ordersRes?.orders || []));
      setLoadedAt(Date.now());
    } catch (e) {
      setError(e.message || 'Failed to refresh admin data');
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({
    items,
    users,
    orders,
    contacts,
    inquiries,
    newsletters,
    subscribers,
    loading,
    error,
    loadedAt,
    refresh,
    // Expose setters for pages that fetch their own non-core resources once and share
    setContacts,
    setInquiries,
    setNewsletters,
    setSubscribers,
  }), [items, users, orders, loading, error, loadedAt, contacts, inquiries, newsletters, subscribers]);
  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};
