import Logo from "@/components/logo";
import { navbarItems } from "@/lib/constants";
import { UserButton } from "@clerk/nextjs";
import NavbarItems from "@/components/navbar/navbar-items";
import ThemeSwitcherButton from "@/components/navbar/theme-switcher-button";

const DesktopNavbar = () => {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="container flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
          <div className="flex h-full">
            {navbarItems.map((item) => (
              <NavbarItems
                key={item.label}
                link={item.link}
                label={item.label}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherButton />
          <UserButton />
        </div>
      </nav>
    </div>
  );
};

export default DesktopNavbar;
