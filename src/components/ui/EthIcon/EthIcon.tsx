import { memo } from 'react';

interface EthIconProps {
  size?: number;
  className?: string;
}

export const EthIcon = memo(function EthIcon({ size = 24, className }: EthIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="12" fill="#627EEA" />
      <path
        d="M12 4L11.91 4.31V14.86L12 14.95L16.77 12.19L12 4Z"
        fill="white"
        fillOpacity="0.6"
      />
      <path d="M12 4L7.23 12.19L12 14.95V9.88V4Z" fill="white" />
      <path
        d="M12 15.93L11.95 15.99V19.73L12 19.88L16.77 13.18L12 15.93Z"
        fill="white"
        fillOpacity="0.6"
      />
      <path d="M12 19.88V15.93L7.23 13.18L12 19.88Z" fill="white" />
      <path d="M12 14.95L16.77 12.19L12 9.88V14.95Z" fill="white" fillOpacity="0.2" />
      <path d="M7.23 12.19L12 14.95V9.88L7.23 12.19Z" fill="white" fillOpacity="0.6" />
    </svg>
  );
});
