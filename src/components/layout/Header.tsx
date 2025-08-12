export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 h-[65px] flex justify-center items-center">
      <div className="px-[10px] mx-auto flex justify-between items-center h-[42px] w-full">
        {/* 로고 */}
        <div className="flex">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <img
              src="/quantusLogo.ced3539c.svg"
              alt="Logo"
              className="w-120 h-26"
            />
          </div>

          {/* 메뉴 */}
          <nav className="hidden md:flex gap-10 font-medium items-center px-[42px]">
            <div className="flex justify-center items-center pt-[5px] cursor-pointer hover:text-gray-500">
              <span>파운드리</span>
            </div>
            <div
              className="flex justify-center items-center pt-[5px] cursor-pointer hover:text-gray-500"
              onClick={() => alert("준비중입니다")}
            >
              고객지원
            </div>
            <div
              className="flex justify-center items-center pt-[5px] cursor-pointer hover:text-gray-500"
              onClick={() => alert("준비중입니다")}
            >
              사용권 구매
            </div>
            <div
              className="flex justify-center items-center pt-[5px] w-[54px] h-[34px] cursor-pointer hover:opacity-80"
              onClick={() => alert("준비중입니다")}
            >
              <img
                src="/headerVIP.webp"
                alt="Logo"
                className="max-w-full max-h-full"
              />
            </div>
          </nav>
        </div>

        {/* 버튼 */}
        <div className="hidden md:block">
          <button
            onClick={() => alert("준비중입니다")}
            className="px-4 py-2 rounded-md transition bg-white text-black text-sm font-bold"
          >
            로그인
          </button>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button className="md:hidden" onClick={() => alert("준비중입니다")}>
          ☰
        </button>
      </div>
    </header>
  );
}
