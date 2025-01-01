import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Button, Input, InputGroup } from "reactstrap";

import '../../Assests/Styles/products.page.css';
import ProductCard from "../../Components/Cards/ProductCard";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import { fetchManufacturer } from "../../Services/Utils/stakeholder";
import fake_product from '../../Assests/Images/fake_product.jpg';
import Toast from "../../Components/Toast";

const Products = () => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const [productIds, setProductIds] = useState([]);
  const [allProducts, setAllProducts] = useState({});
  const [filteredProducts, setFilteredProducts] = useState({});

  // Lấy danh sách tất cả sản phẩm
  useEffect(() => {
    if (contractState.productContract) {
      (async () => {
        const productIds = await contractState.productContract.methods.getItemIds().call({ from: authState.address });
        const products = {};
        for (let i = 0; i < productIds.length; i++) {
          const response = await contractState.productContract.methods.get(productIds[i]).call({ from: authState.address });
          const product = {
            "item": response.item,
            "rawProducts": response.rawProducts,
            "reviews": response.reviews,
            "transactions": response.transactions,
            "manufacturer": await fetchManufacturer(authState.address, contractState.manufacturerContract, response.item["manufacturer"])
          };
          if (product.item.manufacturer !== "0x0000000000000000000000000000000000000000") {
            products[productIds[i]] = product;
          }
        }
        setAllProducts(products);
        setFilteredProducts(products); // Hiển thị tất cả sản phẩm ban đầu
      })();
    }
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = () => {
    const searchValue = document.getElementById("search").value.trim().toLowerCase();
    if (searchValue === "") {
      Toast("error", "Vui lòng nhập tiêu đề sản phẩm");
      return;
    }

    // Lọc sản phẩm theo tiêu đề
    const filtered = Object.keys(allProducts).reduce((result, key) => {
      const product = allProducts[key];
      if (product.item.title && product.item.title.toLowerCase().includes(searchValue)) {
        result[key] = product;
      }
      return result;
    }, {});

    if (Object.keys(filtered).length === 0) {
      Toast("warning", "Không tìm thấy sản phẩm phù hợp");
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="wrapper">
      <div className="heading">Sản phẩm</div>
      <div align="center">
        <div className="col-10 col-md-3">
          <InputGroup>
            <Input placeholder="Tìm kiếm theo tiêu đề" id="search" />
            <Button onClick={handleSearch}>Tìm kiếm</Button>
          </InputGroup>
        </div>
      </div>
      <div className="row">
        {Object.keys(filteredProducts).map(productId => {
          const product = filteredProducts[productId];
          return (
            <div className="col-12 col-md-6" key={productId}>
              <NavLink className="nav-link" to={`/products/${productId}`} state={{ product }}>
                <ProductCard product={product} />
              </NavLink>
            </div>
          );
        })}
        {Object.keys(filteredProducts).length === 0 ? (
          <div align="center">
            <div className="col-10 col-md-6">
              <img src={fake_product} width="100%" alt="Không tìm thấy sản phẩm" />
              <span>Không tìm thấy sản phẩm</span>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Products;
