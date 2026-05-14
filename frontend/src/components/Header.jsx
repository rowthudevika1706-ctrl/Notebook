import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import usePageStore from "../store/usePageStore";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import useSidebarStore from "../store/useSidebarStore";
import Menu from "./Menu";
import DarkModeToggle from "./DarkModeToggle";

const Header = ({ clearUser }) => {
  const navigate = useNavigate();
  const clearCurrentPage = usePageStore((s) => s.clearCurrentPage);
  const [mobileView, setMobileView] = useState(window.innerWidth < 780);
  const toggleSidebar = useSidebarStore((s) => s.toggleSidebar);

  useEffect(() => {
    const handleResize = () => setMobileView(window.innerWidth < 780);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={cn(
        "border-b border-border p-4 flex items-center justify-between bg-card shadow-sm",
        mobileView && "justify-between"
      )}
    >
      {mobileView && <Menu toggleSidebar={toggleSidebar} />}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/")}
        className="flex items-center text-2xl"
      >
        <motion.h1
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="text-2xl font-bold animate-pulse"
        >
          OneNote
        </motion.h1>
      </Button>
      {/* Logout */}
      <div className="flex gap-1">
        <DarkModeToggle />
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2"
        >
          <Button
            size="sm"
            onClick={() => {
              clearUser();
              clearCurrentPage();
              localStorage.removeItem("token");
              navigate("/auth");
            }}
            className="flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            {mobileView ? "" : " Logout"}
          </Button>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
