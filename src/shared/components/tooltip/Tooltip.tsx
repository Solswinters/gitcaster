import React, { useState, useRef, useEffect, useCallback } from 'react';

import { createPortal } from 'react-dom';

import { useComponentBase } from '../../hooks/useComponentBase';

export interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'dark' | 'light' | 'info' | 'success' | 'warning' | 'error';
  delay?: number; // Delay in ms before showing tooltip
  offset?: number; // Distance from target element
  className?: string;
  arrowClassName?: string;
  disabled?: boolean;
  followCursor?: boolean; // Tooltip follows mouse cursor
  interactive?: boolean; // Allow hovering over tooltip content
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  variant = 'dark',
  delay = 200,
  offset = 8,
  className = '',
  arrowClassName = '',
  disabled = false,
  followCursor = false,
  interactive = false,
}) => {
  const { theme } = useComponentBase();
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const targetRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  const calculatePosition = useCallback(() => {
    if (!targetRef.current || !tooltipRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;

    if (followCursor) {
      // Use mouse position
      switch (position) {
        case 'top':
          x = mousePosition.current.x - tooltipRect.width / 2;
          y = mousePosition.current.y - tooltipRect.height - offset;
          break;
        case 'bottom':
          x = mousePosition.current.x - tooltipRect.width / 2;
          y = mousePosition.current.y + offset;
          break;
        case 'left':
          x = mousePosition.current.x - tooltipRect.width - offset;
          y = mousePosition.current.y - tooltipRect.height / 2;
          break;
        case 'right':
          x = mousePosition.current.x + offset;
          y = mousePosition.current.y - tooltipRect.height / 2;
          break;
      }
    } else {
      // Use target element position
      switch (position) {
        case 'top':
          x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          y = targetRect.top - tooltipRect.height - offset;
          break;
        case 'bottom':
          x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          y = targetRect.bottom + offset;
          break;
        case 'left':
          x = targetRect.left - tooltipRect.width - offset;
          y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          break;
        case 'right':
          x = targetRect.right + offset;
          y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          break;
      }
    }

    // Keep tooltip within viewport bounds
    const padding = 8;
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding));

    setCoords({ x, y });
  }, [position, offset, followCursor]);

  const showTooltip = useCallback(() => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  }, [delay, disabled]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (followCursor) {
        mousePosition.current = { x: e.clientX, y: e.clientY };
        calculatePosition();
      }
    },
    [followCursor, calculatePosition],
  );

  useEffect(() => {
    if (visible) {
      calculatePosition();
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition, true);

      if (followCursor) {
        window.addEventListener('mousemove', handleMouseMove);
      }

      return () => {
        window.removeEventListener('resize', calculatePosition);
        window.removeEventListener('scroll', calculatePosition, true);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [visible, calculatePosition, followCursor, handleMouseMove]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return 'bg-gray-900 text-white';
      case 'light':
        return 'bg-white text-gray-900 border border-gray-300';
      case 'info':
        return 'bg-blue-600 text-white';
      case 'success':
        return 'bg-green-600 text-white';
      case 'warning':
        return 'bg-yellow-600 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-900 text-white';
    }
  };

  const getArrowStyles = () => {
    const base = 'absolute w-2 h-2 transform rotate-45';
    const variantColor = variant === 'light' ? 'bg-white border-gray-300' : getVariantStyles().split(' ')[0];

    switch (position) {
      case 'top':
        return `${base} ${variantColor} bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2`;
      case 'bottom':
        return `${base} ${variantColor} top-0 left-1/2 -translate-x-1/2 -translate-y-1/2`;
      case 'left':
        return `${base} ${variantColor} right-0 top-1/2 -translate-y-1/2 translate-x-1/2`;
      case 'right':
        return `${base} ${variantColor} left-0 top-1/2 -translate-y-1/2 -translate-x-1/2`;
      default:
        return `${base} ${variantColor}`;
    }
  };

  // Clone child and add event handlers
  const childWithHandlers = React.cloneElement(children, {
    ref: (node: HTMLElement) => {
      targetRef.current = node;
      // Handle existing ref if any
      const { ref } = children as any;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object') {
        ref.current = node;
      }
    },
    onMouseEnter: (e: React.MouseEvent) => {
      if (!followCursor) {
        showTooltip();
      }
      if (children.props.onMouseEnter) {
        children.props.onMouseEnter(e);
      }
    },
    onMouseLeave: (e: React.MouseEvent) => {
      if (!interactive) {
        hideTooltip();
      }
      if (children.props.onMouseLeave) {
        children.props.onMouseLeave(e);
      }
    },
    onMouseMove: (e: React.MouseEvent) => {
      if (followCursor && !visible) {
        mousePosition.current = { x: e.clientX, y: e.clientY };
        showTooltip();
      }
      if (children.props.onMouseMove) {
        children.props.onMouseMove(e);
      }
    },
    onFocus: (e: React.FocusEvent) => {
      showTooltip();
      if (children.props.onFocus) {
        children.props.onFocus(e);
      }
    },
    onBlur: (e: React.FocusEvent) => {
      hideTooltip();
      if (children.props.onBlur) {
        children.props.onBlur(e);
      }
    },
  });

  const tooltipContent = visible &&
    !disabled &&
    createPortal(
      <div
        ref={tooltipRef}
        className={`tooltip fixed z-50 px-3 py-2 rounded-md shadow-lg text-sm ${getVariantStyles()} ${className}`}
        style={{
          left: `${coords.x}px`,
          top: `${coords.y}px`,
          pointerEvents: interactive ? 'auto' : 'none',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out',
        }}
        role="tooltip"
        aria-hidden={!visible}
        onMouseEnter={() => {
          if (interactive && timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }}
        onMouseLeave={() => {
          if (interactive) {
            hideTooltip();
          }
        }}
      >
        {content}
        {/* Arrow */}
        <div className={`${getArrowStyles()} ${arrowClassName}`}></div>
      </div>,
      document.body,
    );

  return (
    <>
      {childWithHandlers}
      {tooltipContent}
    </>
  );
};

export default Tooltip;
