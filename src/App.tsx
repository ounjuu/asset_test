import "./App.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MainPage from "./components/features/quant/MainPage";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 상단 고정 헤더 */}
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 max-w-6xl pt-[65px] py-8 px-[12px]">
        <MainPage />
      </main>

      {/* 하단 고정 푸터 */}
      <Footer />
    </div>
  );
}
