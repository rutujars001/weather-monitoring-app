import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useWebSocket = (serverUrl = 'http://localhost:5000') => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [liveData, setLiveData] = useState(null);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    console.log('🔌 Initializing WebSocket connection...');
    
    // Create socket connection
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ WebSocket Connected:', newSocket.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ WebSocket Disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔥 WebSocket Connection Error:', error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    // Welcome message from server
    newSocket.on('welcome', (data) => {
      console.log('👋 Welcome message from server:', data);
    });

    // Real-time sensor data updates
    newSocket.on('sensor-update', (data) => {
      console.log('📊 Live sensor update received:', data);
      setLiveData(data);
    });

    // New alerts from server
    newSocket.on('new-alert', (alert) => {
      console.log('🚨 New alert received:', alert);
      setLiveAlerts(prev => [alert, ...prev.slice(0, 4)]); // Keep last 5 alerts
    });

    setSocket(newSocket);

    // Cleanup on component unmount
    return () => {
      console.log('🧹 Cleaning up WebSocket connection');
      newSocket.close();
    };
  }, [serverUrl]);

  // Helper functions
  const requestData = () => {
    if (socket && isConnected) {
      console.log('📤 Requesting real-time data from server');
      socket.emit('request-data');
    }
  };

  const sendMessage = (event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  return {
    socket,
    isConnected,
    liveData,
    liveAlerts,
    connectionError,
    requestData,
    sendMessage
  };
};

export default useWebSocket;
