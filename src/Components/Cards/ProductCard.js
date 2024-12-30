// import product_default from '../../Assests/Images/product_default.jpg';
import Rating from '../Rating';

const ProductCard = ({ product }) => {
  const imageUrl = product.item["image_url"]
  ? `https://gateway.pinata.cloud/ipfs/${product.item["image_url"]}` : ''

  return (
    <div className="my-1">
      <div className="row d-flex justify-content-around align-items-center">
        <div className="col-12 col-md-4">
          <img 
            src={imageUrl}
            width="100%"
            alt="Product Image"
          />
        </div>
        <div className="col-12 col-md-8">
          <span className="card-key">Id: </span>
          <span className="card-value">{product.item["id"]}</span>
          <br />
          <span className="card-key">Tên: </span>
          <span className="card-value">{product.item["title"]}</span>
          <br />
          <span className="card-key">Manufacturer: </span>
          <span className="card-value">{product.manufacturer["name"]}</span>
          <br />
          <span className='d-flex align-items-center'>
            <span className="card-key">Rating: </span> &nbsp;
            <Rating rating={product.item["rating"] / 20} editable={false} />
          </span>
          <br />
          <span className="d-flex justify-content-around">
            {product.manufacturer.isVerified ? (
              <span className="">
                <span className="badge bg-success">Verified</span>
              </span>
            ) : (
              <span className="">
                <span className="badge bg-warning">Not Verified</span>
              </span>
            )}
            {product.manufacturer.isRenewableUsed ? (
              <span className="">
                <span className="badge bg-success">Eco Friendly</span>
              </span>
            ) : (
              <span className="">
                <span className="badge bg-warning">Non Eco Friendly</span>
              </span>
            )}
          </span>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default ProductCard;
