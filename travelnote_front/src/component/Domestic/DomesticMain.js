import { useEffect, useState } from "react";
import axios from "axios";
import "./DomesticMain.css";
import { Link } from "react-router-dom";

const DomesticMain = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [regionList, setRegionList] = useState([]);
  const [searchText, setSearchText] = useState("어디로 여행 떠날까요 ?");
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [reqPage, setReqPage] = useState(1);

  // 필터에 맞게 가져오는 코드
  useEffect(() => {
    axios
      .get(`${backServer}/regions/list/${reqPage}`)
      .then((res) => {
        const koreanRegions = res.data.filter(
          (region) => region.countryName === "대한민국"
        );
        setRegionList((prevList) => [...prevList, ...koreanRegions]);
      })
      .catch((err) => {
        console.error("Error fetching regions:", err);
      });
  }, [reqPage, backServer]);

  // 검색창 초기화, 검색
  useEffect(() => {
    if (searchText === "어디로 여행 떠날까요 ?" || searchText === "") {
      setFilteredRegions(regionList);
    } else {
      const results = regionList.filter((region) =>
        region.regionName.includes(searchText)
      );
      setFilteredRegions(results);
    }
  }, [searchText, regionList]);

  const handleSearch = () => {
    setSearchText(searchText.trim());
  };

  return (
    <div className="domestic-wrap">
      <h1>국내 여행 플래너</h1>
      <div className="search-bar">
        <input
          type="text"
          value={searchText}
          onFocus={() =>
            searchText === "어디로 여행 떠날까요 ?" && setSearchText("")
          }
          onBlur={() =>
            searchText === "" && setSearchText("어디로 여행 떠날까요 ?")
          }
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          검색
        </button>
      </div>

      <div className="city-list">
        {filteredRegions.map((region, index) => (
          <CityCard
            key={index}
            city={region.regionName}
            country={region.countryName}
          />
        ))}
      </div>
      <button className="more-btn" onClick={() => setReqPage(reqPage + 1)}>
        더보기
      </button>
    </div>
  );
};

// 지역 정보에 맞는 이미지 파일 경로 설정
const CityCard = ({ city, country }) => {
  const getImagePath = (city) => {
    switch (city) {
      case "서울":
        return "/images/서울.jpg";
      case "부산":
        return "/images/부산.jpg";
      case "강릉":
        return "/images/강릉.jpg";
      case "대전":
        return "/images/대전.jpg";
      case "인천":
        return "/images/인천.jpg";
      case "제주":
        return "/images/제주.jpg";
      case "가평":
        return "/images/가평.jpg";
      case "거제 통영":
        return "/images/거제 통영.jpg";
      case "경주":
        return "/images/경주.jpg";
      case "군산":
        return "/images/군산.jpg";
      case "남원":
        return "/images/남원.jpg";
      case "목포":
        return "/images/목포.jpg";
      case "수원":
        return "/images/수원.jpg";
      case "안동":
        return "/images/안동.jpg";
      case "여수":
        return "/images/여수.jpg";
      case "영월":
        return "/images/영월.jpg";
      case "울릉도":
        return "/images/울릉도.jpg";
      case "전주":
        return "/images/전주.jpg";
      case "제천":
        return "/images/제천.jpg";
      case "춘천":
        return "/images/춘천.jpg";
      case "포항":
        return "/images/포항.jpg";

      default:
        return "/image/default_img.png"; // 기본 이미지
    }
  };

  const imagePath = getImagePath(city);

  return (
    <div className="city-card" tabIndex={0}>
      <Link to={`/city/${city}`}>
        <img src={imagePath} alt={city} className="city-image" />
        <div className="city-name">
          {city} ({country})
        </div>
      </Link>
    </div>
  );
};

export default DomesticMain;
