import Image from "next/image";
import Link from "next/link";

const Logo = ({ isMobile = false }: { isMobile?: boolean }) => {
  return (
    <>
      {isMobile ? (
        <Link href="/" className="flex items-center gap-2">
          <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-xl font-bold leading-tight tracking-tighter text-transparent">
            IETracker
          </p>
        </Link>
      ) : (
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
          <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
            IETracker
          </p>
        </Link>
      )}
    </>
  );
};

export default Logo;
