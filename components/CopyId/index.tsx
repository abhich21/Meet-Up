import React from 'react'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Props for the CopyId component.
 */
type Props = {
    /** The Room ID that needs to be copied. Can be a string, an array of strings, or undefined. */
    roomId: string | string[] | undefined;
}

/**
 * CopyId component allows users to copy the Room ID to the clipboard.
 * Displays a shortened version of the ID and a copy button.
 *
 * @param {Props} props - The component props containing the Room ID.
 * @returns {JSX.Element | null} A UI component for copying the Room ID or null if invalid.
 */
const CopyId = ({ roomId }: Props) => {
    const { toast } = useToast();

    // Ensure the roomId is a valid string before rendering
    if (!roomId || typeof roomId !== 'string') return null;

    // Shortened version of the Room ID for display
    const shortenedId = `${roomId.slice(0, 8)}...`;

    /**
     * Copies the Room ID to the clipboard and shows a toast notification.
     */
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast({
                description: "Room ID copied to clipboard.",
                className: "bg-neutral-950 text-white border-neutral-700 "
            });
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="absolute flex left-5 top-5 sm:bottom-8 sm:top-auto bg-neutral-700 gap-2 items-center text-white rounded-xl sm:rounded-full pl-4 pr-1 py-1">
            <HoverCard>
                {/* Display shortened Room ID with hover tooltip */}
                <HoverCardTrigger>
                    {shortenedId}
                </HoverCardTrigger>
                <HoverCardContent className="bg-neutral-500 text-white border-none w-fit">
                    Copy Room ID
                </HoverCardContent>
                {/* Copy button */}
                <Copy onClick={copyToClipboard} className='size-7 p-1.5 rounded-full cursor-pointer bg-neutral-900 hover:opacity-75' />
            </HoverCard>
        </div>
    );
}

export default CopyId;
