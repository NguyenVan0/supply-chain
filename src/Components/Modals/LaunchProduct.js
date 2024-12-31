import { useContext, useState } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputGroupText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import "../../Assests/Styles/launchProduct.modal.css";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import Toast from "../Toast";
import axios from "axios";

const LaunchProduct = ({ isModalOpen, toggleModal, manufacturerRP }) => {
  const { authState } = useContext(AuthContext);
  const { contractState, updateStats } = useContext(ContractContext);

  const pinataApiKey = 'd9a26e03959cf6706eb5'; // Thay bằng API Key của bạn
  const pinataSecretApiKey = 'c56057c660fa82278045765ec57f6790c92d09ffcf8689c7ce3dced0e64761ba';  // Thay bằng Secret Key của bạn
console.log('pinataApiKey', pinataApiKey, pinataSecretApiKey)
  // if (typeof pinataApiKey !== "string" || typeof pinataSecretApiKey !== "string") {
  //   throw new Error("API Key và Secret Key phải là chuỗi.");
  // }
  const [product, setProduct] = useState({
    id: "",
    title: "",
    quantity: "",
    unit: "",
    selectedRawProducts: {},
    image: {
      url: "",
      isLoading: false,
    },
  });
  const toggleRP = (rawProductIndex) => {
    setProduct((product) => ({
      ...product,
      selectedRawProducts: {
        ...product.selectedRawProducts,
        [rawProductIndex]: !product.selectedRawProducts[rawProductIndex],
      },
    }));
  }

  // Hàm upload file lên Pinata
  const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: "product-image",
      keyvalues: {
        uploadedBy: "LaunchProduct",
        type: "product-image",
      },
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", options);

    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });
      return res.data.IpfsHash; 
    } catch (error) {
      console.error("Lỗi upload Pinata:", error);
      throw new Error("Upload file lên Pinata thất bại.");
    }
  };

  // Xử lý upload file ảnh
  const handleFileUpload = async (file) => {
    if (!file) {
      Toast("error", "Không tìm thấy file!");
      return;
    }

    if (!file.type.startsWith("image/")) {
      Toast("error", "Chỉ được phép upload file ảnh!");
      return;
    }

    setProduct((prevProduct) => ({
      ...prevProduct,
      image: {
        ...prevProduct.image,
        isLoading: true,
      },
    }));

    try {
      const cid = await uploadToPinata(file);
      setProduct((prevProduct) => ({
        ...prevProduct,
        image: {
          url: `https://gateway.pinata.cloud/ipfs/${cid}`,
          isLoading: false,
        },
      }));
      Toast("success", "Upload ảnh thành công!");
    } catch (error) {
      Toast("error", "Upload ảnh thất bại.");
      setProduct((prevProduct) => ({
        ...prevProduct,
        image: {
          url: "",
          isLoading: false,
        },
      }));
    }
  };
  
  
  const launch = async () => {
    if (product.id === "" || product.title === "") {
      Toast("error", "ID sản phẩm và tiêu đề là bắt buộc!");
      return;
    }
console.log('product', product)
    const selectedRPIndexes = Object.keys(product.selectedRawProducts).filter(
      (key) => product.selectedRawProducts[key]
    );
    const selectedRP = selectedRPIndexes.map((key) => ({
      name: manufacturerRP[key].name,
      isVerified: manufacturerRP[key].isVerified,
    }));

    if (selectedRP.length === 0) {
      Toast("error", "Vui lòng chọn ít nhất một sản phẩm thô!");
      return;
    }

    try {
      let imageCid = "";
      if (product.image.url) {
        imageCid = product.image.url.split("/").pop(); // Lấy CID từ URL
      }

      await contractState.productContract.methods
        .add(product.id, product.title, product.quantity, product.unit, selectedRP, imageCid)
        .send({ from: authState.address });

      await contractState.manufacturerContract.methods
        .launchProduct(product.id)
        .send({ from: authState.address });

      Toast("success", "Sản phẩm đã được ra mắt thành công!");

      setProduct({
        id: "",
        title: "",
        quantity: "",
        unit: "",
        selectedRawProducts: {},
        image: {
          url: "",
          isLoading: false,
        },
      });

      toggleModal();
      updateStats();
    } catch (err) {
      console.error("Lỗi khi ra mắt sản phẩm:", err);
      Toast("error", "Đã xảy ra lỗi khi ra mắt sản phẩm.");
    }
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader>Ra mắt sản phẩm</ModalHeader>
        <ModalBody>
          <InputGroup>
            <Input
              type="file"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
          </InputGroup>
          <div className="mt-4 d-flex justify-content-center">
            {product.image.isLoading ? (
              <p>Đang tải...</p>
            ) : product.image.url ? (
              <img
                src={product.image.url}
                alt="Hình ảnh sản phẩm"
                width="60%"
              />
            ) : (
              <p>Không có ảnh</p>
            )}
          </div>
          <br />

          {/* Nhập ID sản phẩm */}
          <InputGroup>
            <InputGroupText>ID sản phẩm</InputGroupText>
            <Input
              placeholder="Nhập ID sản phẩm"
              value={product.id}
              onChange={(e) =>
                setProduct((product) => ({ ...product, id: e.target.value }))
              }
            />
          </InputGroup>
          <br />

          {/* Nhập tiêu đề sản phẩm */}
          <InputGroup>
            <InputGroupText>Tiêu đề sản phẩm</InputGroupText>
            <Input
              placeholder="Nhập tiêu đề sản phẩm"
              value={product.title}
              onChange={(e) =>
                setProduct((product) => ({
                  ...product,
                  title: e.target.value,
                }))
              }
            />
          </InputGroup>
          <br />
{/* Nhập tiêu đề sản phẩm */}
<InputGroup>
            <InputGroupText>Số lượng sản phẩm</InputGroupText>
            <Input
              placeholder="Nhập số lượng sản phẩm"
              value={product.quantity}
              onChange={(e) =>
                setProduct((product) => ({
                  ...product,
                  quantity: e.target.value,
                }))
              }
            />
          </InputGroup>
          <br />
<InputGroup>
            <InputGroupText>Đơn vị tính</InputGroupText>
            <Input
              placeholder="Nhập đơn vị tính"
              value={product.unit}
              onChange={(e) =>
                setProduct((product) => ({
                  ...product,
                  unit: e.target.value,
                }))
              }
            />
          </InputGroup>
          <br />
          {/* Chọn nguyên liệu thô */}
          <div className="row mt-2 justify-content-around">
            {Object.keys(manufacturerRP).map((rawProductIndex) => {
              const rawProduct = manufacturerRP[rawProductIndex];
              return (
                <div
                  className={`col-5 d-flex justify-content-between 
                  align-items-center my-2 mx-1 raw-product-card 
                  ${
                    product.selectedRawProducts[rawProductIndex]
                      ? "raw-product-card-selected"
                      : ""
                  }`}
                  key={rawProductIndex}
                  onClick={() => toggleRP(rawProductIndex)}
                  type="button"
                >
                  <span className="raw-product-card-name">{rawProduct.name}</span>
                  {rawProduct.isVerified ? (
                    <span className="badge bg-success">Đã xác minh</span>
                  ) : (
                    <span className="badge bg-warning">Chưa xác minh</span>
                  )}
                </div>
              );
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={launch}>Ra mắt</Button>
          <Button
            onClick={() => {
              setProduct({
                id: "",
                title: "",
                selectedRawProducts: {},
                image: {
                  url: "",
                  isLoading: false,
                },
              });
              toggleModal();
            }}
          >
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default LaunchProduct;
