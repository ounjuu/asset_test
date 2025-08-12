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
    color: "#9ca3af" /* tailwind gray-400 */,
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

      {assetBoxes.map(({ id, selectedCategory, selectedAssetName }) => (
        <div key={id} className="flex col">
          {/* 카테고리 select */}
          <div className="flex gap-3">
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
              className="w-48"
            />

            {/* 자산군 select */}
            <Select
              options={getAssetNameOptions(selectedCategory?.value || null)}
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
              className="w-65"
            />
          </div>
          {/* 삭제 버튼 */}
          <button
            onClick={() => handleRemoveBox(id)}
            style={{ padding: "4px 8px" }}
            aria-label="삭제"
          >
            삭제
          </button>
        </div>
      ))}

      <button onClick={handleAddBox}>자산군 추가</button>
    </>
  );
};

export default DataDisplay;
