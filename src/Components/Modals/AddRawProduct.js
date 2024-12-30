import { useContext, useState } from "react";
import { Button, Input, InputGroup, InputGroupText, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import '../../Assests/Styles/rawProduct.modal.css';
import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import { fetchFarmer } from "../../Services/Utils/stakeholder";
import Toast from "../Toast";

const AddRawProduct = ({isModalOpen, toggleModalOpen}) => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const [rawProduct, setRawProduct] = useState({
    name: "",
    suppliers: {},
    selectedSuppliers: {},
  })

  const getSuppliers = async () => {
    const suppliersAddress = await contractState.farmerContract.methods.getRawProductFarmers(rawProduct.name).call({from: authState.address});
    const suppliers = {};
    const selectedSuppliers = {};
    for(var i =0; i<suppliersAddress.length; i++){
      suppliers[i] = await fetchFarmer(authState.address, contractState.farmerContract, suppliersAddress[i]);
      selectedSuppliers[i] = false;
    }
    setRawProduct(rawProduct => {
      return {
        ...rawProduct,
        suppliers,
        selectedSuppliers
      }
    })
  }

  const toggleSupplier = (supplierIndex) => {
    setRawProduct(rawProduct => {
      return {
        ...rawProduct,
        selectedSuppliers: {
          ...rawProduct.selectedSuppliers,
          [supplierIndex]: !rawProduct.selectedSuppliers[supplierIndex]
        }
      }
    });
  }

  const add = async () => {
    if(rawProduct.name === ""){
      Toast("error", "Vui lòng nhập tên sản phẩm thô");
      return;
    }
    const selectedSuppliersIndexes = Object.keys(rawProduct.selectedSuppliers).filter(key => rawProduct.selectedSuppliers[key]);
    const selectedSuppliers = selectedSuppliersIndexes.map(key => {
      return {
        "id": rawProduct.suppliers[key].id,
        "isVerified": rawProduct.suppliers[key].isVerified
      }
    });
    if(selectedSuppliers.length === 0){
      Toast("error", "Vui lòng chọn ít nhất một nhà cung cấp");
      return;
    }
    await contractState.manufacturerContract.methods.addRawProduct(rawProduct.name, selectedSuppliers).send({from: authState.address});
    Toast("success", "Thêm sản phẩm thô thành công");
    setRawProduct({
      name: "",
      suppliers: {},
      selectedSuppliers: {},
    })
    toggleModalOpen();
  }

  return (
    <div>
      <Modal isOpen={isModalOpen} toggle={toggleModalOpen}>
        <ModalHeader>Thêm sản phẩm thô</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupText>
              Tên
            </InputGroupText>
            <Input placeholder="Nhập tên sản phẩm thô" 
              value = {rawProduct.name}
              onChange={(e) => setRawProduct(rawProduct => {
              return {
                ...rawProduct,
                name: e.target.value
              }
            })}/>
            <Button onClick={getSuppliers}>
              Tìm kiếm
            </Button>
          </InputGroup>
          <div className="mt-2">
            {rawProduct.suppliers.length >= 1? 
              <span className="col-12 supplier-wrapper-label">
                Chọn nhà cung cấp
              </span>
            :""}
            {Object.keys(rawProduct.suppliers).map((supplierIndex) => {
              const supplier = rawProduct.suppliers[supplierIndex];
              return (
                <div key={supplierIndex} 
                  className={`my-2 p-1 supplier-card 
                    ${rawProduct.selectedSuppliers[supplierIndex]? "supplier-card-selected" : "" }
                  `} 
                  onClick={() => toggleSupplier(supplierIndex)}
                >
                  <span className="d-flex justify-content-between align-items-center">
                    <span className="supplier-card-address">{supplier.formattedAddress}</span>
                    {supplier.isVerified?
                      <span className="badge bg-success">Đã xác minh</span>
                    :
                      <span className="badge bg-warning">Chưa xác minh</span>
                    }
                  </span>
                  <span className="d-flex justify-content-between align-items-center">
                    <span>{supplier.name}</span>
                    <span>{supplier.location}</span>
                  </span>
                </div>
              )
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={add}>Thêm</Button>
          {" "}
          <Button onClick={() => {
            setRawProduct({
              name: "",
              suppliers: {},
              selectedSuppliers: {},
            })
            toggleModalOpen();
          }}>Hủy</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
export default AddRawProduct;
