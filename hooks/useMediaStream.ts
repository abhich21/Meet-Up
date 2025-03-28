import { useEffect, useRef, useState } from "react";

/**
 * Custom React hook to initialize and manage a user's media stream (audio & video).
 * Ensures that the media stream is set only once per component lifecycle.
 *
 * @returns {Object} An object containing the user's media stream.
 */
const useMediaStream = () => {
    /** State to store the MediaStream object */
    const [state, setState] = useState<MediaStream | null>(null);

    /** Ref to track whether the stream has already been initialized */
    const isStreamSet = useRef(false);

    useEffect(() => {
        // Prevent multiple initializations
        if (isStreamSet.current) return;
        isStreamSet.current = true;

        (async function initStream() {
            try {
                // Request access to the user's microphone and camera
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                });
                console.log("Setting your stream");
                setState(stream);
            } catch (error) {
                console.log(`Error setting up stream with media navigator: ${error}`);
            }
        })();
    }, []);

    return { stream: state };
};

export default useMediaStream;
