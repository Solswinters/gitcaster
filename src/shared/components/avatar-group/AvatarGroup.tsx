import React, { useState } from 'react';
import { useComponentBase } from '../../hooks/useComponentBase';

export interface AvatarData {
  id: string;
  src?: string;
  alt?: string;
  name?: string;
  fallback?: string;
}

export interface AvatarGroupProps {
  avatars: AvatarData[];
  max?: number; // Maximum number of avatars to display before showing "+X"
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  spacing?: 'tight' | 'normal' | 'loose';
  variant?: 'circular' | 'rounded' | 'square';
  showTooltip?: boolean; // Show name on hover
  onAvatarClick?: (avatar: AvatarData) => void;
  onMoreClick?: () => void; // Called when "+X" is clicked
  className?: string;
  avatarClassName?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 5,
  size = 'md',
  spacing = 'normal',
  variant = 'circular',
  showTooltip = true,
  onAvatarClick,
  onMoreClick,
  className = '',
  avatarClassName = '',
}) => {
  const { theme } = useComponentBase();
  const [hoveredAvatar, setHoveredAvatar] = useState<string | null>(null);

  const displayAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  const getSizeStyles = () => {
    switch (size) {
      case 'xs':
        return 'w-6 h-6 text-xs';
      case 'sm':
        return 'w-8 h-8 text-sm';
      case 'md':
        return 'w-10 h-10 text-base';
      case 'lg':
        return 'w-12 h-12 text-lg';
      case 'xl':
        return 'w-16 h-16 text-xl';
      default:
        return 'w-10 h-10 text-base';
    }
  };

  const getSpacingStyles = () => {
    switch (spacing) {
      case 'tight':
        return '-ml-2 first:ml-0';
      case 'loose':
        return '-ml-1 first:ml-0';
      case 'normal':
      default:
        return '-ml-1.5 first:ml-0';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-lg';
      case 'square':
        return 'rounded-none';
      default:
        return 'rounded-full';
    }
  };

  const getFallbackInitials = (avatar: AvatarData): string => {
    if (avatar.fallback) return avatar.fallback;
    if (avatar.name) {
      const names = avatar.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    if (avatar.alt) {
      return avatar.alt[0].toUpperCase();
    }
    return '?';
  };

  const getBorderStyles = () => {
    return 'border-2 border-white dark:border-gray-900';
  };

  const getBackgroundColor = (index: number): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    return colors[index % colors.length];
  };

  const handleAvatarClick = (avatar: AvatarData) => {
    if (onAvatarClick) {
      onAvatarClick(avatar);
    }
  };

  const handleMoreClick = () => {
    if (onMoreClick) {
      onMoreClick();
    }
  };

  return (
    <div className={`avatar-group flex items-center ${className}`} role="group" aria-label="Avatar group">
      {displayAvatars.map((avatar, index) => (
        <div
          key={avatar.id}
          className={`avatar relative ${getSizeStyles()} ${getVariantStyles()} ${getBorderStyles()} ${getSpacingStyles()} ${
            onAvatarClick ? 'cursor-pointer hover:z-10 hover:scale-110' : ''
          } transition-transform ${avatarClassName}`}
          style={{ zIndex: displayAvatars.length - index }}
          onClick={() => handleAvatarClick(avatar)}
          onMouseEnter={() => setHoveredAvatar(avatar.id)}
          onMouseLeave={() => setHoveredAvatar(null)}
          role="img"
          aria-label={avatar.alt || avatar.name || `Avatar ${index + 1}`}
        >
          {avatar.src ? (
            <img
              src={avatar.src}
              alt={avatar.alt || avatar.name || ''}
              className={`w-full h-full object-cover ${getVariantStyles()}`}
              onError={(e) => {
                // Fallback to initials if image fails to load
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling;
                if (fallback) {
                  (fallback as HTMLElement).style.display = 'flex';
                }
              }}
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center text-white font-semibold ${getVariantStyles()} ${getBackgroundColor(
                index,
              )}`}
            >
              {getFallbackInitials(avatar)}
            </div>
          )}

          {/* Fallback element for image errors */}
          {avatar.src && (
            <div
              className={`w-full h-full absolute inset-0 flex items-center justify-center text-white font-semibold ${getVariantStyles()} ${getBackgroundColor(
                index,
              )}`}
              style={{ display: 'none' }}
            >
              {getFallbackInitials(avatar)}
            </div>
          )}

          {/* Tooltip */}
          {showTooltip && avatar.name && hoveredAvatar === avatar.id && (
            <div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50"
              style={{ pointerEvents: 'none' }}
            >
              {avatar.name}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* More avatars indicator */}
      {remainingCount > 0 && (
        <div
          className={`avatar-more relative ${getSizeStyles()} ${getVariantStyles()} ${getBorderStyles()} ${getSpacingStyles()} ${
            onMoreClick ? 'cursor-pointer hover:z-10 hover:scale-110' : ''
          } transition-transform bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center font-semibold`}
          style={{ zIndex: 0 }}
          onClick={handleMoreClick}
          role="button"
          aria-label={`${remainingCount} more avatars`}
          tabIndex={onMoreClick ? 0 : -1}
          onKeyDown={(e) => {
            if (onMoreClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleMoreClick();
            }
          }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;

