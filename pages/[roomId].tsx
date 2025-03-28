import { useSocket } from "@/context/socket"; // Custom hook to manage socket connections
import usePeer from "@/hooks/usePeer"; // Custom hook to manage PeerJS peer connections
import { useParams } from "next/navigation"; // Next.js hook to access URL parameters
import useMediaStream from "@/hooks/useMediaStream"; // Custom hook to manage the user's media stream
import Player from "@/components/Player"; // Player component to display the video stream
import { useEffect, useState } from "react"; // React hooks for side effects and state management
import usePlayer from "@/hooks/usePlayer"; // Custom hook to manage player states
import ControlPanel from "@/components/ControlPanel"; // Control panel for toggling audio/video and leaving the room
import { cloneDeep } from "lodash"; // Deep copy utility for state management
import CopyId from "@/components/CopyId"; // Component for displaying room ID
import { Toaster } from "@/components/ui/toaster"; // Toaster component for notifications
import { MediaConnection } from "peerjs"; // PeerJS MediaConnection type for managing connections

const Room = () => {
  // Get the roomId from URL parameters
  const params = useParams();
  const roomId = typeof params?.roomId === "string" ? params.roomId : "";

  // Access socket instance
  const socket = useSocket()?.socket;

  // Use custom hooks for peer connection, media stream, and player state management
  const { myId, peer } = usePeer();
  const { stream } = useMediaStream();
  const { players, setPlayers, highlightedPlayer, nonHighlightedPlayer, toggleAudio, toggleVideo, leaveRoom } = usePlayer(myId, roomId, peer);

  const [users, setUsers] = useState<Record<string, MediaConnection>>({}); // State to manage users and their media connections

  useEffect(() => {
    // Set up a listener for user connections
    if (!socket || !peer || !stream || !roomId) return;

    const handleUserConnected = (newUser: string) => {
      console.log(`new user ${newUser} joined the room - ${roomId}`);

      // Start a call with the new user and stream their media
      const call = peer.call(newUser, stream);

      // Set up the stream for the new user
      call.on('stream', (incomingStream: MediaStream) => {
        console.log(`Incoming stream from ${newUser}`);
        setPlayers((prev) => ({
          ...prev,
          [newUser]: {
            url: incomingStream,
            muted: false,
            playing: true,
          }
        }));

        // Store the user's connection
        setUsers((prev) => ({
          ...prev,
          [newUser]: call
        }));
      });
    };

    // Listen for new users joining the room
    socket?.on("user-connected", handleUserConnected);

    // Clean up event listener on unmount
    return () => {
      socket?.off("user-connected", handleUserConnected);
    };
  }, [socket, peer, stream, setPlayers, roomId]);

  useEffect(() => {
    // Set up an event listener for incoming calls (i.e., when someone calls the user)
    if (!peer || !stream || !setPlayers) return;

    peer.on('call', (call: MediaConnection) => {
      const { peer: callerId } = call;
      call.answer(stream); // Answer the incoming call with the user's media stream

      // Set up the stream for the incoming caller
      call.on('stream', (incomingStream: MediaStream) => {
        console.log(`Incoming stream from ${callerId}`);
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: false,
            playing: true,
          }
        }));

        // Store the caller's connection
        setUsers((prev) => ({
          ...prev,
          [callerId]: call
        }));
      });
    });
  }, [peer, stream, setPlayers]);

  useEffect(() => {
    // Set the local user's stream when the stream changes
    if (!stream || !myId) return;

    console.log(`setting my stream ${myId}`);
    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        url: stream,
        muted: false,
        playing: true,
      }
    }));
  }, [stream, myId, setPlayers]);

  useEffect(() => {
    // Set up event listeners for audio/video toggles and user leaves
    if (!socket || !setPlayers) return;

    const handleToggleAudio = (userId: string) => {
      console.log(`user with id ${userId} toggled audio`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        if (copy[userId]) {
          copy[userId].muted = !copy[userId].muted;
        }
        return { ...copy };
      });
    };

    const handleToggleVideo = (userId: string) => {
      console.log(`user with id ${userId} toggled video`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        if (copy[userId]) {
          copy[userId].playing = !copy[userId].playing;
        }
        return { ...copy };
      });
    };

    const handleLeaveRoom = (userId: string) => {
      console.log(`User with ${userId} is leaving the room`);
      users[userId]?.close();
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
    };

    // Listen for toggle and leave events
    socket.on("user-toggle-audio", handleToggleAudio);
    socket.on("user-toggle-video", handleToggleVideo);
    socket.on("user-leave", handleLeaveRoom);

    // Clean up event listeners on unmount
    return () => {
      socket.off("user-toggle-video", handleToggleVideo);
      socket.off("user-toggle-audio", handleToggleAudio);
      socket.off("user-leave", handleLeaveRoom);
    };
  }, [socket, setPlayers, users, players]);

  const newMemberJoined = (highlightedPlayer && Object.keys(highlightedPlayer).length > 0);

  return (
    <div className="w-full h-screen bg-neutral-950 ">
      <div className="flex h-[90vh]">
        {highlightedPlayer && Object.keys(highlightedPlayer).map((playerId) => {
          const { url, muted, playing } = highlightedPlayer[playerId];
          return (
            <div key={playerId} className="w-full p-4 transition-all duration-1000 ease-in-out">
              <Player url={url} playerId={playerId} key={playerId} muted={muted} playing={playing} isActive />
            </div>
          );
        })}
        <div className={` transition-all p-4 duration-1000 ease-in-out ${newMemberJoined ? 'w-full w-1/2 xs:w-1/4 sm:w-1/3 md:w-1/4 lg:w-1/5 h-fit absolute top-5 right-5 md:top-10 md:right-10 hover:scale-110 duration-500' : 'w-full '}`}>
          {nonHighlightedPlayer && (<Player className={`shadow-xl ${newMemberJoined && " hover:border-[3px] border-blue-500 transition-all duration-500 ease-in-out"}`} url={nonHighlightedPlayer.url} muted={nonHighlightedPlayer.muted} playerId={"1"} key={1} playing={nonHighlightedPlayer.playing} isActive />)}
        </div>
      </div>
      <div className="h-[10vh] w-full ">
        <CopyId roomId={roomId} />
        <ControlPanel muted={nonHighlightedPlayer?.muted} playing={nonHighlightedPlayer?.playing} toggleAudio={toggleAudio} toggleVideo={toggleVideo} leaveRoom={leaveRoom} />
        <Toaster />
      </div>
    </div>
  );
}

export default Room;
