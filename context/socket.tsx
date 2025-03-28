import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { DefaultEventsMap } from '@socket.io/component-emitter';

/**
 * Defines the shape of the socket context, including the socket instance and any errors.
 */
interface SocketContextType {
    /** The Socket.io instance used for real-time communication. */
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
    /** Error message, if any, encountered during socket connection. */
    error: string | null;
}

// Create a context for the Socket instance
const SocketContext = createContext<SocketContextType | null>(null);

/**
 * Hook to access the Socket context.
 * 
 * @returns {SocketContextType | null} The current socket instance and error state.
 */
const useSocket = () => {
    return useContext(SocketContext);
};

/**
 * Provides a Socket.io connection to its children.
 * Manages socket initialization and error handling.
 * 
 * @param {Object} props - Component props.
 * @param {ReactNode} props.children - The child components wrapped by the provider.
 * @returns {JSX.Element} A context provider for managing WebSocket connections.
 */
const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Establish a new WebSocket connection
        const socketConnection = io();
        setSocket(socketConnection);
    }, []);

    // Handle connection errors
    socket?.on('connect_error', async (err) => {
        setError(err.message);
        console.log("Error establishing socket", err.message);

        // Attempt to reinitialize the connection via an API request
        await fetch('api/socket');
    });

    return (
        <SocketContext.Provider value={{ socket, error }}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketContext, SocketProvider, useSocket };
