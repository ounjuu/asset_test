const fs = require("fs");
const path = require("path");

const assetData = {
  "한국 자산군": ["코스피", "코스닥", "KOSPI200"],
  "미국 자산군": [
    "나스닥",
    "나스닥 인버스",
    "미국10년국채",
    "미국2년국채",
    "미국30년국채",
    "미국단기채",
    "원자재",
  ],
  전략: ["안정형", "공격형", "중립형"],
  "한국 ETF": ["KODEX 200", "TIGER 코스닥150", "ARIRANG ESG"],
  "미국 ETF": ["SPY", "QQQ", "VTI"],
  "한국 주식": ["삼성전자", "현대차", "네이버"],
  "미국 주식": ["애플", "테슬라", "아마존"],
};

const kinds = Object.keys(assetData);
const totalCount = 100000;
const data = [];

for (let i = 0; i < totalCount; i++) {
  const kind = kinds[i % kinds.length];
  const assets = assetData[kind];
  const asset = assets[i % assets.length];

  data.push({
    id: i + 1,
    category: kind,
    assetName: asset,
  });
}

// public/data 폴더가 없으면 생성
const dir = path.join(__dirname, "public", "data");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// JSON 파일 경로
const filePath = path.join(dir, "all_asset_data_100000.json");

// JSON 파일 저장
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

console.log(`파일 생성 완료: ${filePath}`);
