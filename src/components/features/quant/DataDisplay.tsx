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
// select style
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
    backgroundColor: state.isFocused
      ? "#1f2937" /* tailwind gray-800 */
      : "black",
    color: "white",
    cursor: "pointer",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "white",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "white" /* tailwind gray-400 */,
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
  const [value, setValue] = useState("0");

  // input 숫자 제어
  const handleChange = (e: any) => {
    let val = e.target.value;
    // 빈 문자열 허용 (입력 초기화)
    if (val === "") {
      setValue(val);
      return;
    }
    // 숫자만 허용
    val = Number(val);
    if (val >= 0 && val <= 100) {
      setValue(val);
    }
  };

  // 여러 자산군 박스 상태 (id별로 category, assetName 선택 관리)
  const [assetBoxes, setAssetBoxes] = useState<
    {
      id: number;
      selectedCategory: AssetOption | null;
      selectedAssetName: AssetOption | null;
    }[]
  >([]);

  const [boxIdCounter, setBoxIdCounter] = useState(0);

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

        // 초기 박스 1개 생성
        setAssetBoxes([
          { id: 0, selectedCategory: null, selectedAssetName: null },
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

  // 2) categoryOptions를 useMemo로 메모이제이션
  const categoryOptions: AssetOption[] = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(data.map((item) => item.category))
    );
    return uniqueCategories.map((category) => ({
      label: category,
      value: category,
    }));
  }, [data]);

  // 3) getAssetNameOptions도 useMemo로 최적화
  const getAssetNameOptions = useMemo(() => {
    // 이 함수는 category별 assetName 배열을 캐싱하는 Map을 만듭니다.
    const map = new Map<string, AssetOption[]>();

    // 모든 카테고리별로 미리 assetName 리스트 생성
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

    // category가 주어지면 해당 assetName 리스트 반환하는 함수 리턴
    return (category: string | null): AssetOption[] => {
      if (!category) return [];
      return map.get(category) || [];
    };
  }, [data, categoryOptions]);

  // 박스 추가
  const handleAddBox = () => {
    setAssetBoxes((prev) => [
      ...prev,
      { id: boxIdCounter, selectedCategory: null, selectedAssetName: null },
    ]);
    setBoxIdCounter((prev) => prev + 1);
  };

  // 박스 삭제
  const handleRemoveBox = (id: number) => {
    setAssetBoxes((prev) => prev.filter((box) => box.id !== id));
  };

  // 카테고리 변경 시
  const handleCategoryChange = (id: number, option: AssetOption | null) => {
    setAssetBoxes((prev) =>
      prev.map((box) =>
        box.id === id
          ? { ...box, selectedCategory: option, selectedAssetName: null }
          : box
      )
    );
  };

  // 자산군 변경 시
  const handleAssetNameChange = (id: number, option: AssetOption | null) => {
    setAssetBoxes((prev) =>
      prev.map((box) =>
        box.id === id ? { ...box, selectedAssetName: option } : box
      )
    );
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
        {/* 왼쪽 컨텐츠: 자산군 리스트 등 */}
        <div className="flex-1 pr-6">
          <div className="text-start font-bold pb-3">
            <span className="pr-1 ">자산군 추가</span>
            <span className="text-green-400">[필수]</span>
          </div>
          {assetBoxes.map(
            ({ id, selectedCategory, selectedAssetName }, index) => (
              <div key={id} className="flex flex-col ">
                <div className="text-start pb-[8px]">
                  자산 {String(index + 1).padStart(2, "0")}
                </div>

                {/* 카테고리 select */}
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
                  {/* 자산군 select */}
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
                  {/* 비중 input */}
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
                          value={value}
                          onChange={handleChange}
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
                {/* 삭제 버튼 */}
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

          <button onClick={handleAddBox}>자산군 추가</button>
        </div>

        {/* 오른쪽 버튼 4개 스티키 박스 */}
        <div className="sticky top-20 flex flex-col gap-4 w-40">
          <button className="px-4 py-2 bg-green-500 text-green-200 rounded hover:bg-green-600  font-bold transition">
            저장하기
          </button>
          <button className="px-4 py-2 bg-white text-black rounded transition font-bold">
            백테스트
          </button>
          <button className="px-4 py-2 bg-white text-black rounded transition font-bold">
            포트 추출
          </button>
          <button className="px-4 py-2 border-2 border-gray-500 rounded bg-black text-white font-bold text-xs">
            ⤺ 설정 값 초기화
          </button>
        </div>
      </div>
    </>
  );
};

export default DataDisplay;
