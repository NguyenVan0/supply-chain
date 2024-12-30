import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import '../../Assests/Styles/card.css';
import Toast from "../Toast";
import manufacturer_default from "../../Assests/Images/manufacturer_default.jpg";
import { fetchManufacturer } from "../../Services/Utils/stakeholder";

const ManufacturerCard = ({ id, manufacturerObject }) => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const role = authState.stakeholder.role;
  const [manufacturer, setManufacturer] = useState({
    id: "00000",
    name: "",
    location: "",
    isRenewableUsed: false,
    rawProducts: [],
  });

  useEffect(() => {
    if (manufacturerObject) {
      setManufacturer(manufacturerObject);
    } else if (contractState.manufacturerContract) {
      (async () => {
        setManufacturer(await fetchManufacturer(
          authState.address,
          contractState.manufacturerContract,
          id
        ))
      })();
    }
  }, [manufacturerObject]);

  const verify = async () => {
    try {
      await contractState.manufacturerContract.methods.verify(id).send({ from: authState.address });
      setManufacturer(manufacturer => {
        return {
          ...manufacturer,
          isVerified: true
        }
      })
      Toast("success", "Nhà sản xuất đã được xác minh thành công");
    } catch (e) {
      Toast("error", e.message);
    }
  }

  const update = async () => {
    try {
      await contractState.manufacturerContract.methods.updateEnergy(id).send({ from: authState.address });
      setManufacturer(manufacturer => {
        return {
          ...manufacturer,
          isRenewableUsed: true
        }
      })
      Toast("success", "Đã cập nhật năng lượng tái tạo của nhà sản xuất");
    } catch (e) {
      Toast("error", e.message);
    }
  }

  return (
    <div className="col-12 col-lg-6 my-1">
      <div className="row d-flex justify-content-around align-items-center">
        <div className="col-12 col-md-4">
          <img 
            src={manufacturer_default}
            width="100%"
            alt="Hình mặc định của nhà sản xuất"
          />
        </div>
        <div className="col-12 col-md-8">
          <span className="card-key">Mã số: </span>
          <span className="card-value">{manufacturer.formattedAddress}</span>
          <br />
          <span className="card-key">Tên: </span>
          <span className="card-value">{manufacturer.name}</span>
          <br />
          <span className="card-key">Địa điểm: </span>
          <span className="card-value">{manufacturer.location}</span>
          <br />
          <span className="card-key">Vai trò: </span>
          <span className="card-value">{manufacturer.role === "manufacturer" ? 'Nhà sản xuất' : manufacturer.role === 'distributer' ? 'Nhà phân phối' : manufacturer.role === 'consumer' ? 'Khách hàng' : 'stakeholder.role'}</span>
          <br />
          <span className="">
            <span className="card-key">Năng lượng sử dụng: </span>
            {manufacturer.isRenewableUsed ?
              <span className="">
                <span className="badge bg-success">Tái tạo</span>
              </span>
              :
              <span className="">
                <span className="badge bg-warning">Không tái tạo</span>
                {role === "admin" ?
                  <span
                    className="badge bg-dark mx-1"
                    type="button"
                    onClick={update}
                  >
                    <i className="fa fa-fire" /> Cập nhật
                  </span>
                  : ""
                }
              </span>
            }
          </span>
          <br />
          <span className="">
            <span className="card-key">Trạng thái xác minh: </span>
            {manufacturer.isVerified ?
              <span className="">
                <span className="badge bg-success">Đã xác minh</span>
              </span>
              :
              <span className="">
                <span className="badge bg-warning">Chưa xác minh</span>
                {role === "admin" ?
                  <span
                    className="badge bg-dark mx-1"
                    type="button"
                    onClick={verify}
                  >
                    <i className="fa fa-certificate" /> Xác minh
                  </span>
                  : ""
                }
              </span>
            }
          </span>
          <br />
          <span>
            <span className="d-flex justify-content-between">
              <span className="card-key">Nguyên vật liệu</span>
              <span className="card-key">Nguồn gốc</span>
            </span>
            {manufacturer.rawProducts.map(rawProduct => (
              <span className="d-flex justify-content-between my-1" key={rawProduct.name}>
                <span className="card-value">{rawProduct["name"]}</span>
                {rawProduct["isVerified"] ?
                  <span className="badge bg-success">Đã xác minh</span>
                  :
                  <span className="badge bg-danger">Chưa xác minh</span>
                }
              </span>
            ))}
          </span>
        </div>
      </div>
      <hr />
    </div>
  )
}

export default ManufacturerCard;
