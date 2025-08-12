import { FaInstagram, FaYoutube, FaThreads } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="text-start w-screen text-gray-500 py-12 px-[10px]">
      <div className="w-full max-w-none">
        {/* 로고 및 회사 정보 */}
        <div className="text-start md:items-center mb-8 space-y-6 md:space-y-0 w-full">
          <div className="flex items-center space-x-3">
            <img src="/quantusLogo.ced3539c.svg" />
          </div>
          <div className="flex w-full justify-between">
            <div className="text-xs">
              <br />
              <p>주식회사 퀀터스 테크놀로지스 | 대표자: 이재민</p>
              <br />
              <p>서울특별시 강남구 선릉로 93길 54, 6층 (역삼동, 일환빌딩)</p>
              <p>
                사업자등록번호: 245-88-02569 | 통신판매신고:
                제2024-서울강남-05978호
              </p>
              <p>
                사업 제안/제휴 문의:{" "}
                <a
                  href="mailto:info@quantus.kr"
                  className="underline hover:text-gray-100"
                >
                  info@quantus.kr
                </a>{" "}
                | 퀀터스 이용 관련 문의는{" "}
                <a
                  href="https://pf.kakao.com/_hxjWZn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-100"
                >
                  카카오톡 채널
                </a>
                로 부탁드립니다.
              </p>
            </div>

            {/* 고객센터 */}
            <a
              href="https://pf.kakao.com/_hxjWZn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-gray-100 text-xs"
            >
              <br />
              카카오톡 고객센터
            </a>
          </div>
        </div>

        {/* SNS 아이콘 */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 ">
          <div className="flex space-x-4">
            {/* 인스타그램 */}
            <a href="#" className="hover:text-gray-100" aria-label="Instagram">
              <FaInstagram className="w-5 h-5" />
            </a>

            {/* 유튜브 */}
            <a href="#" className="hover:text-gray-100" aria-label="YouTube">
              <FaYoutube className="w-5 h-5" />
            </a>

            {/* Threads */}
            <a href="#" className="hover:text-gray-100" aria-label="Threads">
              <FaThreads className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* 저작권 및 약관 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-xs border-t border-gray-700 pt-6 space-y-4 md:space-y-0">
          <div className="max-w-lg">
            <p>© 2023 Quantus Technologies. All rights reserved.</p>
            <p className="mt-2 text-gray-400">
              퀀터스에서 제공하는 정보는 단순 투자 참고 사항이며, 제공된 정보에
              의한 투자 결과에 법적인 책임을 지지 않습니다.
            </p>
          </div>
          <div className="flex space-x-6 text-xs text-gray">
            <button className="hover:cursor-pointer">개인정보처리방침</button>
            <span className="inline-block px-5 py-2.5 text-base font-medium font-inherit duration-250">
              |
            </span>
            <button className="hover:cursor-pointer">이용약관</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
