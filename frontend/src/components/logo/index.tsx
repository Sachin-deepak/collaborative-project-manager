// import { AudioWaveform } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  url?: string;
  wrapper?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ url = '/', wrapper = true, size = 'sm' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-[40px]',
    md: 'h-[60px]',
    lg: 'h-[80px]'
  };

  const LogoContent = () => (
    <img
      src="/logo/logo.png"
      alt="Compiler Crew Logo"
      className={`inline-block w-auto ${sizeClasses[size]}`}
    />
  );

  return (
    <div className="flex items-center justify-center sm:justify-start">
      {wrapper ? (
        <Link to={url}>
          <LogoContent />
        </Link>
      ) : (
        <LogoContent />
      )}
    </div>
  );
};

export default Logo;

