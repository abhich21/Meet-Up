import { Mic, MicOff, Video, VideoOff } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import CallEndIcon from '../../public/end-call.svg'

/**
 * Props for the ControlPanel component.
 */
type Props = {
    /** Indicates whether the user's microphone is muted. */
    muted: boolean;
    /** Indicates whether the user's video is playing. */
    playing: boolean;
    /** Function to toggle the user's microphone on or off. */
    toggleAudio: () => void;
    /** Function to toggle the user's video on or off. */
    toggleVideo: () => void;
    /** Function to leave the current call or room. */
    leaveRoom: () => void;
}

/**
 * ControlPanel component provides buttons to manage audio, video, and leaving a call.
 * 
 * @param {Props} props - Component props containing audio/video state and control functions.
 * @returns {JSX.Element} A control panel UI for video calls.
 */
const ControlPanel = (props: Props) => {
    const { muted, playing, toggleAudio, toggleVideo, leaveRoom } = props

    return (
        <div className='w-full h-full text-center text-white px-4 pb-4 '>
            <div className='w-fit max-w-md h-fit mx-auto gap-6 flex items-center justify-around'>

                {/* Button to toggle the microphone */}
                <button
                    onClick={toggleAudio}
                    className={`p-3 rounded-full h-fit transition-all ease-in duration-300 w-fit hover:opacity-75 
                    ${muted ? "bg-red-200  text-rose-800" : " bg-neutral-700  text-neutral-200"}`}
                >
                    {muted ? <MicOff className='' /> : <Mic className=' ' />}
                </button>

                {/* Button to leave the call */}
                <button
                    onClick={leaveRoom}
                    className='p-4 bg-rose-600 transition-all ease-in duration-300 shadow-md shadow-rose-900 hover:opacity-75 rounded-3xl'
                >
                    <Image width={32} src={CallEndIcon} alt="call-end-icon" />
                </button>

                {/* Button to toggle the video */}
                <button
                    onClick={toggleVideo}
                    className={`p-3 rounded-full h-fit transition-all ease-in duration-300 w-fit hover:opacity-75 
                    ${playing ? "bg-neutral-700  text-neutral-200" : "bg-red-200  text-rose-800 "}`}
                >
                    {playing ? <Video className='' /> : <VideoOff className=' ' />}
                </button>

            </div>
        </div>
    )
}

export default ControlPanel
