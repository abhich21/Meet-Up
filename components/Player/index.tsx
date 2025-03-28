import { CircleUserRound, Mic, MicOff, Video, VideoOff } from "lucide-react";
import ReactPlayer from "react-player"
import { SourceProps } from "react-player/base";

/**
 * Props for the Player component.
 */
type Props = {
    /** The media source, which can be a URL, a MediaStream, an array of URLs, or an array of source objects. */
    url: string | MediaStream | string[] | SourceProps[] | undefined;
    /** Unique identifier for the player instance, used as a key. */
    playerId: string;
    /** Boolean flag to determine if the audio is muted. */
    muted: boolean;
    /** Boolean flag to control whether the video is playing. */
    playing: boolean;
    /** Indicates if the current player is active. */
    isActive: boolean;
    /** Optional additional class names for styling. */
    className?: string;
}

/**
 * Player component for rendering a video or a placeholder when not playing.
 * It supports multiple media sources and displays user status icons.
 *
 * @param {Props} props - The component props.
 * @returns {JSX.Element} A video player component with controls and user indicators.
 */
const Player = (props: Props) => {
    const { url, playerId, muted, playing, isActive, className } = props;

    return (
        <div className={`w-full h-full overflow-hidden bg-neutral-800 rounded-2xl relative ${className}`}>
            <div className="w-full h-full relative">
                {/* Render ReactPlayer when playing, otherwise show a placeholder */}
                {playing ? (
                    <ReactPlayer
                        className="z-0"
                        width="100%"
                        height="100%"
                        url={url}
                        key={playerId}
                        muted={muted}
                        playing={playing}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-around p-6">
                        <CircleUserRound className="w-24 h-24 bg-neutral-700 p-4 rounded-full text-neutral-800" />
                    </div>
                )}

                {/* Overlay icons for microphone and video status */}
                <div className="absolute text-white bottom-3 left-3 p-2 rounded-full bg-neutral-700/40 flex gap-3 backdrop-blur-md">
                    {isActive ? (muted ? <MicOff className="z-10 text-neutral-400" /> : <Mic className="z-2" />) : undefined}
                    {isActive ? (playing ? <Video className="z-10" /> : <VideoOff className="z-2 text-neutral-400" />) : undefined}
                </div>
            </div>
        </div>
    );
}

export default Player;
