import { useLocation } from "react-router-dom";

import Header from "./AdminHeader";
import Sidebar from "./AdminSider";
import Footer from "./AdminFooter";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isExcludedPage = location.pathname === '/login' || location.pathname === '/404';
  
    return (
      <div className="flex flex-col h-screen">
        {/* 로그인 페이지나 404 페이지가 아닐 경우 헤더와 사이드바 렌더링 */}
        {!isExcludedPage && <Header />}
        <div className="flex flex-1 overflow-hidden">
          {!isExcludedPage && <Sidebar />}
          <main className={`flex-1 ${!isExcludedPage ? 'overflow-y-auto' : ''}`}>
            {children}
          </main>
        </div>
        {!isExcludedPage && <Footer />}
      </div>
    );
  };
  
  export default AppLayout;