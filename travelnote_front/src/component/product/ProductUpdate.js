import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loginEmailState } from "../utils/RecoilData";
import axios from "axios";
import ProductFrm from "./ProductFrm";
import ToastEditor from "../utils/ToastEditor";

const ProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();
  const productNo = params.productNo;
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [productName, setProductName] = useState("");
  const [productSubName, setProductSubName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productInfo, setProductInfo] = useState("");
  const [productLatitude, setProductLatitude] = useState("");
  const [productLongitude, setProductLongitude] = useState("");
  const [productStatus, setProductStatus] = useState(1);

  // 썸네일 파일을 새로 전송하기 위한 state
  const [thumbnail, setThumbnail] = useState(null);
  // 첨부파일을 새로 전송하기 위한 state
  const [productFile, setProductFile] = useState([]);

  // 조회해온 썸네일을 화면에 보여주기 위한 state
  const [productThumb, setProductThumb] = useState(null);
  // 조회해온 파일목록을 화면에 보여주기 휘한 state
  const [fileList, setFileList] = useState([]);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  // 기존 첨부파일을 삭제하면 삭제한 파일 번호를 저장할 배열
  const [delProductFileNo, setDelProductFileNo] = useState([]);

  // 상품명 입력
  const inputProductName = (e) => {
    setProductName(e.target.value);
  };
  // 상품 서브명 입력
  const inputProductSubName = (e) => {
    setProductSubName(e.target.value);
  };
  // 가격 입력
  const inputProductPrice = (e) => {
    setProductPrice(e.target.value);
  };
  // 위도 입력
  const inputProductLatitude = (e) => {
    setProductLatitude(e.target.value);
  };
  // 경도 입력
  const inputProductLongitude = (e) => {
    setProductLongitude(e.target.value);
  };

  useEffect(() => {
    axios
      .get(`${backServer}/product/productNo/${productNo}`)
      .then((res) => {
        console.log(res);
        setProductName(res.data.productName);
        setProductSubName(res.data.productSubName);
        setProductThumb(res.data.productThumb);
        setProductPrice(res.data.productPrice);
        setProductInfo(res.data.productInfo);
        setProductLatitude(res.data.productLatitude);
        setProductLongitude(res.data.productLongitude);
        setProductStatus(res.data.productStatus);
        setFileList(res.data.fileList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const updateProduct = () => {
    if (productName !== "" && productSubName !== "" && productInfo !== "") {
      const form = new FormData();
      form.append("productNo", productNo);
      form.append("productName", productName);
      form.append("productSubName", productSubName);
      form.append("productPrice", productPrice);
      form.append("productInfo", productInfo);
      form.append("productLatitude", productLatitude);
      form.append("productLongitude", productLongitude);
      form.append("productWriter", loginEmail);
      form.append("productStatus", productStatus);
      if (productThumb !== null) {
        form.append("productThumb", productThumb);
      }
      if (thumbnail !== null) {
        form.append("thumbnail", thumbnail);
      }
      for (let i = 0; i < productFile.length; i++) {
        form.append("productFile", productFile[i]);
      }
      for (let i = 0; i < delProductFileNo.length; i++) {
        form.append("delProductFileNo", delProductFileNo[i]);
      }
      axios
        .patch(`${backServer}/product`, form, {
          headers: {
            contentType: "multipart/form-data",
            processData: false,
          },
        })
        .then((res) => {
          console.log(res);
          setProductStatus(res.data.productStatus);
          console.log(res.data.productStatus);
          if (res.data) {
            navigate(`/product/view/${productNo}`);
          } else {
            // 실패 시 로직
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <section className="section product-content-wrap">
      <div className="section-title">등록 상품 수정</div>
      <form
        className="product-write-frm"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <ProductFrm
          // 로그인 유저
          loginEmail={loginEmail}
          // 상품 번호
          productNo={productNo}
          // 상품명
          productName={productName}
          setProductName={inputProductName}
          // 상품 한 줄 소개
          productSubName={productSubName}
          setProductSubName={inputProductSubName}
          // 상품 썸네일
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          // 상품 첨부파일
          productFile={productFile}
          setProductFile={setProductFile}
          // 조회해온 썸네일, 파일 목록
          productThumb={productThumb}
          setProductThumb={setProductThumb}
          fileList={fileList}
          setFileList={setFileList}
          // 상품 가격
          productPrice={productPrice}
          setProductPrice={inputProductPrice}
          // 상품 위도
          productLatitude={productLatitude}
          setProductLatitude={inputProductLatitude}
          // 상품 경도
          productLongitude={productLongitude}
          setProductLongitude={inputProductLongitude}
          // 상품 판매여부
          productStatus={productStatus}
          setProductStatus={setProductStatus}
          // 삭제한 첨부파일 번호
          delProductFileNo={delProductFileNo}
          setDelProductFileNo={setDelProductFileNo}
        />
        <div className="product-content-wrap">
          <ToastEditor
            productInfo={productInfo}
            setProductInfo={setProductInfo}
            type={1}
          />
        </div>
        <div className="button-box">
          <button className="btn-primary lg" onClick={updateProduct}>
            수정하기
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProductUpdate;
