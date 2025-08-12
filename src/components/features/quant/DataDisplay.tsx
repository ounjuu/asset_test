import React, { useEffect, useState, useMemo } from "react";
import Select, { components } from "react-select";
import { FixedSizeList as List } from "react-window";
import type { MenuType, DataItem } from "./types";

interface Props {
  menu: MenuType;
}

interface AssetOption {
  label: string;
  value: string;
}

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "black",
    color: "white",
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "black",
    color: "white",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#1f2937" : "black",
    color: "white",
    cursor: "pointer",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "white",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "white",
  }),
};

const MenuList = (props: any) => {
  const { options, children, maxHeight, getValue } = props;
  const height = 35;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * height;

  return (
    <List
      height={Math.min(maxHeight, options.length * height)}
      itemCount={children.length}
      itemSize={height}
      initialScrollOffset={initialOffset}
      width="100%"
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </List>
  );
};

const DataDisplay: React.FC<Props> = ({ menu }) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 여기 value를 각 박스마다 개별 관리하도록 변경
  // (기존 하나의 value는 모든 박스의 비중을 공유하는 문제 있음)
  // 자산군 박스 구조에 비중도 추가
  const [assetBoxes, setAssetBoxes] = useState<
    {
      id: number;
      selectedCategory: AssetOption | null;
      selectedAssetName: AssetOption | null;
      weight: string; // 비중을 문자열로 관리 (빈 문자열 가능)
    }[]
  >([]);

  const [boxIdCounter, setBoxIdCounter] = useState(0);

  // 준비중 메시지 상태
  const [readyMessage, setReadyMessage] = useState<string | null>(null);

  // 1) 데이터 fetch 및 초기화
  useEffect(() => {
    if (menu === "coin") return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = "/data/all_asset_data_100000.json";
        const res = await fetch(url);
        if (!res.ok) throw new Error("데이터를 불러오는데 실패했습니다.");
        const json = (await res.json()) as DataItem[];
        setData(json);

        // 초기 박스 1개 생성, 비중 초기값 빈 문자열
        setAssetBoxes([
          {
            id: 0,
            selectedCategory: null,
            selectedAssetName: null,
            weight: "",
          },
        ]);
        setBoxIdCounter(1);
      } catch (e: any) {
        setError(e.message || "알 수 없는 에러");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [menu]);

  const categoryOptions: AssetOption[] = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(data.map((item) => item.category))
    );
    return uniqueCategories.map((category) => ({
      label: category,
      value: category,
    }));
  }, [data]);

  const getAssetNameOptions = useMemo(() => {
    const map = new Map<string, AssetOption[]>();
    categoryOptions.forEach(({ value: category }) => {
      const uniqueAssetNames = Array.from(
        new Set(
          data
            .filter((item) => item.category === category)
            .map((item) => item.assetName)
        )
      );
      map.set(
        category,
        uniqueAssetNames.map((assetName) => ({
          label: assetName,
          value: assetName,
        }))
      );
    });

    return (category: string | null): AssetOption[] => {
      if (!category) return [];
      return map.get(category) || [];
    };
  }, [data, categoryOptions]);

  // 박스 추가
  const handleAddBox = () => {
    setAssetBoxes((prev) => [
      ...prev,
      {
        id: boxIdCounter,
        selectedCategory: null,
        selectedAssetName: null,
        weight: "",
      },
    ]);
    setBoxIdCounter((prev) => prev + 1);
  };

  // 박스 삭제
  const handleRemoveBox = (id: number) => {
    setAssetBoxes((prev) => prev.filter((box) => box.id !== id));
  };

  // 카테고리 변경
  const handleCategoryChange = (id: number, option: AssetOption | null) => {
    setAssetBoxes((prev) =>
      prev.map((box) =>
        box.id === id
          ? { ...box, selectedCategory: option, selectedAssetName: null }
          : box
      )
    );
  };

  // 자산군 변경
  const handleAssetNameChange = (id: number, option: AssetOption | null) => {
    setAssetBoxes((prev) =>
      prev.map((box) =>
        box.id === id ? { ...box, selectedAssetName: option } : box
      )
    );
  };

  // 비중 변경 (개별 박스)
  const handleWeightChange = (id: number, val: string) => {
    // 숫자 및 빈 문자열 허용, 0~100 제한
    if (val === "") {
      setAssetBoxes((prev) =>
        prev.map((box) => (box.id === id ? { ...box, weight: val } : box))
      );
      return;
    }
    const num = Number(val);
    if (num >= 0 && num <= 100) {
      setAssetBoxes((prev) =>
        prev.map((box) => (box.id === id ? { ...box, weight: val } : box))
      );
    }
  };

  // 초기화 버튼 클릭 시
  const handleReset = () => {
    setAssetBoxes([
      { id: 0, selectedCategory: null, selectedAssetName: null, weight: "" },
    ]);
    setBoxIdCounter(1);
    setReadyMessage(null);
  };

  // 준비중 버튼 클릭 시
  const handleReadyClick = (btnName: string) => {
    setReadyMessage(`${btnName} 준비중입니다.`);
    // 2초 뒤 메시지 사라짐
    setTimeout(() => setReadyMessage(null), 2000);
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (menu === "coin") return <p>준비중입니다.</p>;
  if (data.length === 0) return <p>데이터가 없습니다.</p>;

  return (
    <>
      <h2 className="w-full flex justify-start underline decoration-2 decoration-white text-lg font-bold pb-5">
        자산배분
      </h2>

      <div className="flex justify-between items-start">
        {/* 왼쪽 컨텐츠 */}
        <div className="flex-1 pr-6">
          <div className="text-start font-bold pb-3">
            <span className="pr-1 ">자산군 추가</span>
            <span className="text-green-400">[필수]</span>
          </div>
          {assetBoxes.map(
            ({ id, selectedCategory, selectedAssetName, weight }, index) => (
              <div key={id} className="flex flex-col ">
                <div className="text-start pb-[8px]">
                  자산 {String(index + 1).padStart(2, "0")}
                </div>

                <div className="flex justify-between gap-4">
                  <div className="flex flex-col justify-start text-gray-500 text-sm flex-1">
                    <div className="w-full text-left font-semibold mb-1 pb-3">
                      종류
                    </div>
                    <Select
                      options={categoryOptions}
                      value={selectedCategory}
                      onChange={(option) => handleCategoryChange(id, option)}
                      components={{ MenuList }}
                      styles={customStyles}
                      menuPortalTarget={
                        typeof window !== "undefined" ? document.body : null
                      }
                      menuPosition="fixed"
                      placeholder="카테고리 선택"
                      isClearable
                      className="text-white text-xs"
                    />
                  </div>

                  <div className="flex flex-col justify-start text-gray-500 text-sm flex-1">
                    <div className="w-full text-left font-semibold mb-1 pb-3">
                      자산군
                    </div>
                    <Select
                      options={getAssetNameOptions(
                        selectedCategory?.value || null
                      )}
                      value={selectedAssetName}
                      onChange={(option) => handleAssetNameChange(id, option)}
                      components={{ MenuList }}
                      styles={customStyles}
                      menuPortalTarget={
                        typeof window !== "undefined" ? document.body : null
                      }
                      menuPosition="fixed"
                      placeholder="자산군을 선택해주세요."
                      isClearable
                      isDisabled={!selectedCategory}
                      className="text-xs text-white text-bold"
                    />
                  </div>

                  <div className="flex flex-col justify-start text-gray-500 text-sm flex-1">
                    <div className="w-full text-left font-semibold mb-1 pb-3">
                      비중
                    </div>
                    <div>
                      <div className="relative inline-block w-full">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          className="w-full border border-gray-300 rounded px-2 py-2 bg-black text-white text-sm text-center"
                          value={weight}
                          onChange={(e) =>
                            handleWeightChange(id, e.target.value)
                          }
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                          %
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 pt-2">
                        0 ~ 100까지 입력할 수 있습니다.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mr-3 text-end">
                  <button
                    onClick={() => handleRemoveBox(id)}
                    aria-label="삭제"
                    className="text-red-600 text-sm"
                  >
                    삭제
                  </button>
                </div>
              </div>
            )
          )}

          <button
            onClick={handleAddBox}
            className="mt-2 px-3 py-1 rounded border border-gray-500 text-sm"
          >
            자산군 추가
          </button>
        </div>

        {/* 오른쪽 버튼 */}
        <div className="sticky top-20 flex flex-col gap-4 w-40">
          <button
            className="px-4 py-2 bg-green-500 text-green-200 rounded hover:bg-green-600 font-bold transition"
            onClick={() => handleReadyClick("저장하기")}
          >
            저장하기
          </button>
          <button
            className="px-4 py-2 bg-white text-black rounded transition font-bold"
            onClick={() => handleReadyClick("백테스트")}
          >
            백테스트
          </button>
          <button
            className="px-4 py-2 bg-white text-black rounded transition font-bold"
            onClick={() => handleReadyClick("포트 추출")}
          >
            포트 추출
          </button>
          <button
            className="px-4 py-2 border-2 border-gray-500 rounded bg-black text-white font-bold text-xs"
            onClick={handleReset}
          >
            ⤺ 설정 값 초기화
          </button>
          {/* 준비중 메시지 표시 */}
          {readyMessage && (
            <p className="mt-2 text-center text-red-500 font-semibold">
              {readyMessage}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default DataDisplay;
