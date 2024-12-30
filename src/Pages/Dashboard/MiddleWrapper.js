import Carousel from "react-multi-carousel";
import { Card, CardBody, CardImg, CardTitle } from "reactstrap";
import img_traceability from '../../Assests/Images/dashboard/traceability.jpg';
import img_tradeability from '../../Assests/Images/dashboard/tradeability.jpg';
import img_reputation_system from '../../Assests/Images/dashboard/reputation_system.jpg';

const MiddleWrapper = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  const features = [
    {
      image: img_traceability,
      title: "Truy xuất nguồn gốc",
      description: "Cơ chế để theo dõi nguồn gốc sản phẩm và chuỗi phân phối. Điều này giúp đảm bảo rằng sản phẩm an toàn và đáng tin cậy."
    },
    {
      image: img_tradeability,
      title: "Khả năng giao dịch",
      description: "Cơ chế giao dịch sản phẩm với các bên liên quan khác. Điều này giúp đảm bảo rằng sản phẩm là chính hãng và đáng tin cậy."
    },
    {
      image: img_reputation_system,
      title: "Hệ thống đánh giá danh tiếng",
      description: `Cơ chế cho phép người dùng đánh giá sản phẩm trên thị trường để xây dựng niềm tin thông qua danh tiếng.`
    }
  ]
  return (
    <div className="middle-wrapper">
      <h5 className="mw-heading" >
        Luôn sẵn sàng <b>"Phục vụ người tiêu dùng"</b> với Nền tảng Trải nghiệm Người tiêu dùng Toàn diện được hỗ trợ bởi Blockchain
      </h5>
      <Carousel responsive={responsive}>
        {features.map((feature, index) => (
          <Card className="border-0" key={index} >
            <CardImg
              src = {feature.image}
              height = "300px"
            />
            <CardBody>
              <CardTitle tag="h5" className="text-center text-uppercase mw-heading">
                {feature.title}
              </CardTitle>
              <span className="mw-sub-heading">
                {feature.description}
              </span>
            </CardBody>
          </Card>
        ))}
      </Carousel>
      <hr/>
    </div>
  )
}
export default MiddleWrapper;
