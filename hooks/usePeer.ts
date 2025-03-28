import { useSocket } from "@/context/socket"; // Import the custom hook for accessing the socket context
import { useParams } from "next/navigation"; // Import the hook to access URL parameters in Next.js
import Peer from "peerjs"; // Import PeerJS for peer-to-peer communication
import { useEffect, useRef, useState } from "react"; // Import React hooks

const usePeer = () => {
    // State to store the PeerJS instance
    const [peer, setPeer] = useState<Peer | null>(null);

    // State to store the Peer ID of the current user
    const [myId, setMyId] = useState('');

    // Ref to ensure the Peer instance is only set once
    const isPeerSet = useRef<boolean>(false);

    // Access the socket instance from the socket context
    const socket = useSocket()?.socket;

    // Access the roomId from URL parameters
    const roomId = useParams()?.roomId;

    useEffect(() => {
        // Prevent setting the Peer instance if it's already set or if socket/roomId is missing
        if (isPeerSet.current || !socket || !roomId) return;

        // Mark that the Peer instance has been set
        isPeerSet.current = true;

        // Create a new Peer instance
        const myPeer = new Peer();

        // Set the Peer instance in state
        setPeer(myPeer);

        // Listen for the 'open' event and emit 'join-room' to join the specified room
        myPeer.on('open', (id) => {
            console.log("My Peer ID is ", id); // Log the Peer ID
            setMyId(id); // Set the Peer ID in state
            socket?.emit('join-room', roomId, id); // Emit the 'join-room' event to the server with roomId and Peer ID
        });
    }, [roomId, socket, isPeerSet.current]); // Re-run the effect if roomId or socket changes

    // Return the Peer instance and the current Peer ID
    return { peer, myId };
};

export default usePeer;
