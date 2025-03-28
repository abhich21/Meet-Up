import { v4 as uuidv4 } from 'uuid'; // Importing the uuidv4 function to generate unique room IDs
import { useRouter } from 'next/navigation'; // Importing the useRouter hook from Next.js for navigation
import { useState } from 'react'; // Importing useState hook from React for managing component state
import Button from '@/components/Button'; // Importing a custom Button component
import { Toaster } from '@/components/ui/toaster'; // Importing a Toaster component to show toast notifications
import { useToast } from '@/hooks/use-toast'; // Importing the useToast hook to trigger toast notifications
import Link from 'next/link'; // Importing Link component from Next.js for navigation

/**
 * Home Component
 * 
 * This is the main page component of the MeetUp app that allows users to either join an existing room
 * by entering a room ID or create a new room by generating a unique ID.
 */
export default function Home() {
  const router = useRouter(); // Using the Next.js useRouter hook for navigation
  const [roomId, setRoomId] = useState(''); // Managing state for the room ID input field
  const { toast } = useToast(); // Using the custom hook to trigger toast notifications

  /**
   * createAndJoinRoom function
   * 
   * This function generates a unique room ID using uuidv4 and navigates to the new room page.
   */
  const createAndJoinRoom = () => {
    const newRoomId = uuidv4(); // Generating a new unique room ID
    router.push(`/${newRoomId}`); // Navigating to the new room page using the generated room ID
  };

  /**
   * joinRoom function
   * 
   * This function checks if a room ID is provided by the user. If the room ID is valid,
   * it navigates to that room page. If not, it shows a toast notification asking the user
   * to enter a valid Room ID.
   */
  const joinRoom = () => {
    if (roomId) router.push(`/${roomId}`); // Navigating to the room if the room ID is valid
    else toast({ // Triggering a toast notification if the room ID is empty or invalid
      description: "Please enter a valid Room ID",
      variant: 'destructive' // Setting the variant for the toast notification
    });
  };

  return (
    <div className='w-full h-screen text-center bg-neutral-900 text-white'>
      <Toaster /> {/* Toaster component for showing toast notifications */}

      <div className='flex flex-col p-4 items-center justify-center w-full h-[95vh]'>
        <h1 className='text-4xl font-bold mb-4'>
          <span className='meetup-text text-5xl'>MeetUp</span> - Connect Instantly
        </h1>
        <p className='text-lg text-neutral-400 mb-6'>
          No sign-ups, no downloads—just smooth, secure video calls with MeetUp. Stay connected with ease.
        </p>

        <div className='flex flex-col gap-4 max-w-xs w-full'>
          {/* Input for entering a room ID */}
          <input
            placeholder='Enter Room ID'
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)} // Updating the room ID state as the user types
            className='bg-neutral-800 text-white placeholder-neutral-500 px-4 py-2 w-full border border-neutral-700 rounded-md'
          />
          {/* Button to join an existing room */}
          <Button text='Join a Room' onClick={joinRoom} />
        </div>

        <span className='my-4 text-neutral-500'>------ OR ------</span>

        {/* Button to create and join a new room */}
        <Button text='Create a New Room' onClick={createAndJoinRoom} />
      </div>

      <div className="w-full h-[5vh] bg-neutral-800 flex gap-1 items-center justify-center text-neutral-500">
        {/* Footer section*/}
        Made with ❤️ by
        <Link href="https://portfolio-new-five-black.vercel.app/" className="hover:opacity-75 text-gradient bg-gradient-to-br from-indigo-300 to-indigo-700">
          Abhishek
        </Link>
      </div>
    </div>
  );
}
