import { useContext, useEffect, useState } from 'react';

import '../../Assests/Styles/product.page.css';
import { useLocation } from 'react-router-dom';
import { fetchManufacturer, formattedAddress } from '../../Services/Utils/stakeholder';
import { ContractContext } from '../../Services/Contexts/ContractContext';
import { AuthContext } from '../../Services/Contexts/AuthContext';
import Toast from '../../Components/Toast';
import Rating from '../../Components/Rating';

const Product = () => {
  const location = useLocation();
  const { authState } = useContext(AuthContext);
  const { contractState, updateStats } = useContext(ContractContext);
  const [product, setProduct] = useState(location.state.product);
  const [transferState, setTransferState] = useState({
    from: authState.address,
  });
  const [reviewState, setReviewState] = useState({
    rating: 0,
    comment: "",
    from: authState.address,
  })
  const [isOwner, setIsOwner] = useState(authState.address.toLowerCase() === location.state.product.item["currentOwner"].toLowerCase());

  const reload = async () => {
    const id = location.state.product.item.id;
    const response = await contractState.productContract.methods.get(id).call({from: authState.address});
    const product = {
      "item": response.item,
      "rawProducts": response.rawProducts,
      "reviews": response.reviews,
      "transactions": response.transactions,
      "manufacturer": await fetchManufacturer(authState.address, contractState.manufacturerContract, response.item["manufacturer"])
    }
    setProduct(product);
  }

  const transfer = async () => {
    await contractState.productContract.methods.transfer(transferState.to, product.item.id).send({from: authState.address});
    await reload();
    Toast("success", "Chuyển sản phẩm thành công!");
    setTransferState({
      from: authState.address,
    });
    updateStats();
  }

  const postReview = async () => {
    if (!isOwner) {
      Toast("error", "Bạn không phải là chủ sở hữu sản phẩm này!");
      return;
    }
    await contractState.productContract.methods.addReview(product.item.id, reviewState.rating, reviewState.comment).send({from: authState.address});
    await reload();
    Toast("success", "Đánh giá đã được đăng thành công!");
    setReviewState({
      rating: 0,
      comment: "",
      from: authState.address,
    });
    updateStats();
  }

  const features = [
    {
      "icon": <i className="fa fa-certificate fa-2x"/>,
      "label": "Sản phẩm đã xác minh"
    },
    {
      "icon": <i className="fa fa-shield fa-2x"/>,
      "label": "Giao dịch an toàn"
    },
    {
      "icon": <i className="fa fa-rotate-left fa-2x"/>,
      "label": "Chính sách hoàn trả"
    },
    {
      "icon": <i className="fa fa-lock fa-2x"/>,
      "label": "Cung cấp qua Blockchain"
    },
    {
      "icon": <i className="fa fa-check fa-2x"/>,
      "label": "Sản phẩm chính hãng"
    }
  ]
  const imageUrl = product.item["image_url"]
  ? `https://gateway.pinata.cloud/ipfs/${product.item["image_url"]}` : '';

  return (
    <div className="wrapper">
      <div className="row top-wrapper">
        <div className="col-12 col-md-4 tw-left">
        <img 
            src={imageUrl} width="100%"/>
        </div>
        <div className="col-12 col-md-8 tw-right">
          <span className="tw-heading1">
            {product.item["title"]}
          </span>
          <br/>
          <span className='tw-product-stats d-flex align-items-center'>
            <Rating rating={product.item["rating"]/20} editable={false}/>
            &nbsp;| &nbsp;
            <span>
              {product.reviews.length} đánh giá &nbsp;| &nbsp;
            </span>
            <span>
              {product.transactions.length} giao dịch
            </span>
          </span>
          {new Date(product.item["launchDate"] * 1000).toLocaleDateString("vi-VN")}
          <br/>
          <span className='tw-features d-flex justify-content-around'>
            {features.map((feature, index) => (
              <span className='text-center' key={index}>
                {feature.icon}
                <br/>
                <span>{feature.label}</span>
              </span>
            ))}
          </span>
          <span className='tw-brand'>
            Thương hiệu: {product.manufacturer["name"]} &nbsp;| &nbsp;
            {product.manufacturer.isRenewableUsed ?
              <span className="">
                <span className="badge bg-success">Thân thiện môi trường</span>
              </span>
            :
              <span className="">
                <span className="badge bg-warning">Không thân thiện môi trường</span>
              </span>
            }
          </span>
          <br/>
          <span className='tw-seller text-wrap'>
            Được bán bởi: {formattedAddress(product.item["currentOwner"])}
          </span>
          <br/>
          <div className='tw-transfer-wrapper'>
            <input type="text" placeholder='Địa chỉ nhận' disabled={!isOwner}
              onChange={
                (e) => {
                  setTransferState({
                    ...transferState,
                    to: e.target.value
                  })
                }
              }/>
            &nbsp;
            &nbsp;
            <button 
              disabled={!isOwner}
              onClick={transfer}
            >Chuyển</button>
          </div>
        </div>
      </div>
      <hr/>
      <div className="middle-wrapper">
        <span className='heading'>
          Thành phần
        </span>
        <br/>
        <span>
          {product.rawProducts.map((rawProduct, index) => (
            <span className='me-3' key={index}>
              {rawProduct["name"]} &nbsp;
              {rawProduct["isVerified"] ?
                <i className='text-success fa fa-check' title='Đã xác minh'/>
              :
                <i className='text-warning fa fa-exclamation' title='Chưa xác minh'/>
              }
            </span>
          ))}
        </span>
      </div>
      <hr/>
      <div className="bottom-wrapper">
        <div className='row'>
          <div className='col-12 col-md-6'>
            <span className='heading'>
              Giao dịch
            </span>
            {product.transactions.map((transaction, index) => (
              <div className='my-1 border' key={index}>
                Chuyển từ: {formattedAddress(transaction["from"])}
                <br/>
                Chuyển tới: {formattedAddress(transaction["to"])}
                <br/>
                Ngày: {new Date(transaction["date"] * 1000).toLocaleDateString("vi-VN")}
              </div>
            ))}
          </div>
          <div className='col-12 col-md-6'>
            <span className='heading'>
              Đánh giá
            </span>
            <div className='bw-review-wrapper'>
              <textarea placeholder='Bình luận' className='col-10' disabled={!isOwner}
                onChange={
                  (e) => {
                    setReviewState({
                      ...reviewState,
                      comment: e.target.value
                    })
                  }
                }/>
              <br/>
              <span className='d-flex align-items-center'>
                <Rating rating={reviewState.rating} editable={isOwner} onChange={
                  (rating) => {
                    setReviewState({
                      ...reviewState,
                      rating: rating * 20
                    })
                  }
                }/>
                <button onClick={postReview} disabled={!isOwner}>Đăng</button>
              </span>
              <br/>
            </div>
            {product.reviews.map((review, index) => (
              <div className='my-1 border' key={index}>
                <span className='d-flex align-items-center'>
                  <Rating rating={review["rating"]/20} editable={false}/>
                  &nbsp;
                  <span className='badge bg-success'>Đã xác minh mua hàng</span>
                </span>
                Người đánh giá: {formattedAddress(review["reviewer"])}
                <br/>
                Ngày đánh giá: {new Date(review["date"] * 1000).toLocaleDateString("vi-VN")}
                <br/>
                {review["comment"]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Product;
