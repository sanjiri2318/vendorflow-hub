import { getChannelLogo } from '@/utils/channelLogos';

interface ChannelIconProps {
  channelId: string;
  fallbackIcon?: string;
  logoUrl?: string;
  className?: string;
  size?: number;
}

export function ChannelIcon({ channelId, fallbackIcon, logoUrl, className, size = 20 }: ChannelIconProps) {
  // Priority: 1) explicit logoUrl prop, 2) built-in logo asset, 3) fallback emoji
  const builtInLogo = getChannelLogo(channelId);
  const src = logoUrl || builtInLogo;
  
  if (src) {
    return (
      <img 
        src={src} 
        alt={channelId} 
        className={className}
        style={{ width: size, height: size, objectFit: 'contain', borderRadius: 4 }}
      />
    );
  }
  
  if (fallbackIcon) {
    return <span className={className}>{fallbackIcon}</span>;
  }
  
  return null;
}
