import { useContext, useState } from "react";
import { Button, Input, InputGroup, InputGroupText } from "reactstrap";

import '../Assests/Styles/register.page.css';
import { AuthContext } from "../Services/Contexts/AuthContext";
import { ContractContext } from "../Services/Contexts/ContractContext";
import Toast from "../Components/Toast";

const Register = () => {
  const { authState } = useContext(AuthContext);
  const { contractState, loadStakeholder } = useContext(ContractContext)
  const [stakeholder, setStakeholder] = useState({
    name: "",
    location: "",
    role: "farmer"
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStakeholder({
      ...stakeholder,
      [name]: value
    })
  }

  const register = async () => {
    let contract = null;
    switch (stakeholder.role) {
      case "farmer":
        contract = contractState.farmerContract;
        break;
      case "manufacturer":
        contract = contractState.manufacturerContract;
        break;
      default:
        contract = contractState.stakeholderContract;
    }
    if (contract) {
      await contract.methods.register(stakeholder.name, stakeholder.location, stakeholder.role).send({ from: authState.address });
      Toast("success", "Đăng ký thành công");
      loadStakeholder();
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className="col-11 col-sm-10 col-md-5 register-card">
          <span className="register-card-heading">Đăng ký</span>
          <hr/>
          <InputGroup>
            <InputGroupText>
              Tên
            </InputGroupText>
            <Input placeholder="Tên của bạn" name="name" onChange={(e)=> handleChange(e)}/>
          </InputGroup>
          <br/>
          <InputGroup>
            <InputGroupText>
              Địa chỉ
            </InputGroupText>
            <Input placeholder="Địa chỉ của bạn" name="location" onChange={(e)=> handleChange(e)}/>
          </InputGroup>
          <br/>
          <InputGroup>
            <InputGroupText>
              Vai trò
            </InputGroupText>
            <Input type="select" name="role" onChange={(e)=> handleChange(e)}>
              <option value="farmer">Nông dân</option>
              <option value="manufacturer">Nhà sản xuất</option>
              <option value="distributer">Nhà phân phối</option>
              <option value="retailer">Nhà bán lẻ</option>
              <option value="consumer">Người tiêu dùng</option>
            </Input>
          </InputGroup>
          <br/>
          <Button onClick={register}>Đăng ký</Button>
        </div>
      </div>
    </div>
  )
}
export default Register;
