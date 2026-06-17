'use client';

import React, { useState, useEffect } from 'react';

interface KeywordAnimationProps {
    text: string;
    delay?: number;
}

export const KeywordAnimation: React.FC<KeywordAnimationProps> = ({ text, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <span
            className={`block transition-all duration-700 ease-out transform ${
                isVisible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-12'
            }`}
        >
      {text}
    </span>
    );
};