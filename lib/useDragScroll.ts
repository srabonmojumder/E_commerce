'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

interface UseDragScrollOptions {
    /** Speed multiplier for dragging (default: 1.25) */
    speed?: number;
    /** Disable drag scroll */
    disabled?: boolean;
}

/**
 * Hook to enable smooth mouse drag-to-scroll on any horizontal overflow container.
 * - Supports momentum inertia on release
 * - Prevents accidental link clicks when dragging
 * - Temporarily disables smooth snap during active drag for fluid 60fps tracking
 */
export function useDragScroll<T extends HTMLElement = HTMLDivElement>(options: UseDragScrollOptions = {}) {
    const { speed = 1.25, disabled = false } = options;
    const ref = useRef<T>(null);
    const [isDragging, setIsDragging] = useState(false);
    const stateRef = useRef({
        isDown: false,
        startX: 0,
        scrollLeft: 0,
        hasMoved: false,
        lastX: 0,
        velX: 0,
        animationId: 0,
    });

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        if (disabled || !ref.current) return;
        // Only left click
        if (e.button !== 0) return;

        const slider = ref.current;
        cancelAnimationFrame(stateRef.current.animationId);

        stateRef.current.isDown = true;
        stateRef.current.hasMoved = false;
        stateRef.current.startX = e.pageX - slider.offsetLeft;
        stateRef.current.scrollLeft = slider.scrollLeft;
        stateRef.current.lastX = e.pageX;
        stateRef.current.velX = 0;

        setIsDragging(true);
    }, [disabled]);

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (!stateRef.current.isDown || !ref.current) return;
        const slider = ref.current;
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - stateRef.current.startX) * speed;

        if (Math.abs(walk) > 4) {
            stateRef.current.hasMoved = true;
        }

        // Velocity tracking for inertia glide
        stateRef.current.velX = (e.pageX - stateRef.current.lastX);
        stateRef.current.lastX = e.pageX;

        slider.scrollLeft = stateRef.current.scrollLeft - walk;
    }, [speed]);

    const stopDragging = useCallback(() => {
        if (!stateRef.current.isDown) return;
        stateRef.current.isDown = false;
        setIsDragging(false);

        const slider = ref.current;
        if (!slider) return;

        // Momentum glide after drag release
        let vel = stateRef.current.velX * speed * 1.5;
        const decay = 0.94;

        const momentum = () => {
            if (Math.abs(vel) > 0.3 && slider) {
                slider.scrollLeft -= vel;
                vel *= decay;
                stateRef.current.animationId = requestAnimationFrame(momentum);
            }
        };

        if (Math.abs(vel) > 1.5) {
            stateRef.current.animationId = requestAnimationFrame(momentum);
        }
    }, [speed]);

    // Prevent child click if user moved mouse more than threshold
    const onClickCapture = useCallback((e: React.MouseEvent) => {
        if (stateRef.current.hasMoved) {
            e.stopPropagation();
            e.preventDefault();
            stateRef.current.hasMoved = false;
        }
    }, []);

    useEffect(() => {
        return () => {
            cancelAnimationFrame(stateRef.current.animationId);
        };
    }, []);

    return {
        ref,
        isDragging,
        events: {
            onMouseDown,
            onMouseMove,
            onMouseUp: stopDragging,
            onMouseLeave: stopDragging,
            onClickCapture,
        },
        dragClassName: `cursor-grab select-none ${isDragging ? '!cursor-grabbing !snap-none !scroll-auto' : ''}`,
    };
}
