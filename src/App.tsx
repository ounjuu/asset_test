import "./App.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 상단 고정 헤더 */}
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-[65px] py-8">
        {/* 여기에 페이지 내용 */}
        <h1 className="text-2xl font-bold mb-4">메인 페이지</h1>
        <p className="text-gray-700">메인</p>
      </main>

      {/* 하단 고정 푸터 */}
      <Footer />
    </div>
  );
}
