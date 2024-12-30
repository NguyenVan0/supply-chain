import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import '../../Assests/Styles/card.css';
import Toast from "../Toast";
import stakeholder_default from '../../Assests/Images/stakeholder_default.jpg';
import { fetchStakeholder } from "../../Services/Utils/stakeholder";

const StakeholderCard = ({ id }) => {
  const {authState} = useContext(AuthContext);
  const {contractState} = useContext(ContractContext);
  const [stakeholder, setStakeholder] = useState({
    id: "00000",
    name: "",
    location: "",
    formattedAddress: "",
  });

  // Lấy thông tin stakeholder khi component được mount
  useEffect(() => {
    (async () => {
      setStakeholder(await fetchStakeholder(
        authState.address,
        contractState.stakeholderContract,
        id
      ));
    })();
  }, []);

  return (
    <div className="col-12 col-lg-6 my-1">
      <div className="row d-flex justify-content-around align-items-center">
        <div className="col-12 col-md-4">
          <img 
            src={stakeholder_default}
            width="100%"
            alt="Ảnh đại diện của đối tác"
          />
        </div>
        <div className="col-12 col-md-8">
          <span className="card-key">Mã số: </span>
          <span className="card-value">{stakeholder.formattedAddress}</span>
          <br/>
          <span className="card-key">Tên: </span>
          <span className="card-value">{stakeholder.name}</span>
          <br/>
          <span className="card-key">Địa điểm: </span>
          <span className="card-value">{stakeholder.location}</span>
          <br/>
          <span className="card-key">Vai trò: </span>
          <span className="card-value">{stakeholder.role === "manufacturer" ? 'Nhà sản xuất' : stakeholder.role === 'distributer' ? 'Nhà phân phối' : stakeholder.role === 'consumer' ? 'Khách hàng' : stakeholder.role === "retailer" ? 'Nhà bán lẻ' : 'stakeholder.role'}</span>
          <br/>
          {/* <span className="">
            <span className="card-key"> Trạng thái xác thực: </span>
            {stakeholder.isVerified?
              <span className="">
                <span className="badge bg-success">Đã xác thực</span>
              </span>
            :
              <span className="">
                <span className="badge bg-warning">Chưa xác thực</span>
              </span>
            }
          </span> */}
        </div>
      </div>
      <hr/>
    </div>
  )
}

export default StakeholderCard;
