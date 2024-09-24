import axios from "axios";
import { useEffect, useState } from "react";
import PagiNavi from "../utils/PagiNavi";
import { useRecoilValue } from "recoil";
import { isLoginState } from "../utils/RecoilData";
import { Link, useNavigate } from "react-router-dom";

const BoardList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [boardList, setBoardList] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [pi, setPi] = useState({});
  const isLogin = useRecoilValue(isLoginState);

  useEffect(() => {
    axios
      .get(`${backServer}/board/list/${reqPage}`)
      .then((res) => {
        console.log(res);
        setBoardList(res.data.list);
        setPi(res.data.pi);
        console.log(pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);
  return (
    <section>
      <div>자유게시판</div>
      {isLogin ? <Link to="/board/write">글쓰기</Link> : ""}
      <div>
        <ul>
          {boardList.map((board, i) => {
            return <BoardItem key={"board" + i} board={board} />;
          })}
        </ul>
        <div>
          <PagiNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
        </div>
      </div>
    </section>
  );
};

const BoardItem = (props) => {
  const board = props.board;
  const navigate = useNavigate();
  return (
    <li
      onClick={() => {
        navigate(`/board/view/${board.boardNo}`);
      }}
    >
      <div>
        <span>{board.boardNo}</span>
        <span>{board.boardTitle}</span>
        <span>{board.boardWriter}</span>
        <span>{board.boardDate}</span>
        <span>{board.boardReadCount}</span>
        <span>{board.boardLike}</span>
      </div>
    </li>
  );
};
export default BoardList;
