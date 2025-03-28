import { useState } from "react"; // Import React's useState hook
import { cloneDeep } from 'lodash'; // Import cloneDeep from lodash for deep cloning objects
import { useSocket } from "@/context/socket"; // Import the custom hook for accessing the socket context
import { useRouter } from "next/router"; // Import Next.js' useRouter hook for routing

// Define the Player type with url, muted, and playing properties
type Player = {
    url: MediaStream;
    muted: boolean;
    playing: boolean;
};

const usePlayer = (myId: string, roomId: string, peer: any) => {
    // Access the socket instance from the socket context
    const socket = useSocket()?.socket;

    // Access the Next.js router instance
    const router = useRouter();

    // State to store the players and their corresponding properties
    const [players, setPlayers] = useState<Record<string, Player>>({});

    // Create a deep copy of the players state for manipulation
    const playersCopy = cloneDeep(players);

    // Extract the current player's data
    const nonHighlightedPlayer = playersCopy[myId];

    // Delete the current player from the players copy
    delete playersCopy[myId];

    // Store the remaining players (those other than the current one)
    const highlightedPlayer = playersCopy;

    // Function to handle leaving the room
    const leaveRoom = () => {
        socket?.emit('user-leave', myId, roomId); // Emit a 'user-leave' event with the user's ID and room ID
        console.log(`leaving room ${roomId}`);
        peer?.disconnect(); // Disconnect from the peer
        router.push('/'); // Redirect the user to the home page
    };

    // Function to toggle audio for the current player
    const toggleAudio = () => {
        console.log("I toggled my audio");
        setPlayers((prev) => {
            // Create a deep copy of the previous state
            const copy = cloneDeep(prev);
            if (copy[myId]) {
                copy[myId].muted = !copy[myId].muted; // Toggle the muted status
            }
            return { ...copy }; // Return the updated state
        });

        // Emit a socket event to notify the server of the audio change
        if (socket) {
            socket.emit('user-toggle-audio', myId, roomId);
        } else {
            console.warn("Socket is not connected"); // Warn if socket is not available
        }
    };

    // Function to toggle video for the current player
    const toggleVideo = () => {
        console.log("I toggled my video");
        setPlayers((prev) => {
            // Create a deep copy of the previous state
            const copy = cloneDeep(prev);
            if (copy[myId]) {
                copy[myId].playing = !copy[myId].playing; // Toggle the playing status
            }
            return { ...copy }; // Return the updated state
        });

        // Emit a socket event to notify the server of the video change
        if (socket) {
            socket.emit('user-toggle-video', myId, roomId);
        } else {
            console.warn("Socket is not connected"); // Warn if socket is not available
        }
    };

    // Return the current player's data, the list of other players, and the functions for toggling audio/video and leaving the room
    return { players, setPlayers, highlightedPlayer, nonHighlightedPlayer, toggleAudio, toggleVideo, leaveRoom };
};

export default usePlayer;
