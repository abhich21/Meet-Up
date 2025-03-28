import React from 'react';

type Props = {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    text: string
};

const Button = (props: Props) => {
    const { onClick, text } = props
    return (
        <button
            className='px-4 py-1 border border-neutral-500 rounded-lg bg-neutral-700 hover:opacity-75'
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default Button;
