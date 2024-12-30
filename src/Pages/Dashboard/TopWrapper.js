import img_cover from '../../Assests/Images/dashboard/top_wrapper.jpg';
const TopWrapper  = () => {
  return (
    <div className="top-wrapper">
      <div className="row d-flex justify-content-between">
        <div className="col-12 col-md-6">
          <img src={img_cover} width="100%"/>
        </div>
        <div className="col-12 col-md-6">
          <div className="tw-about text-center">
            <p className="tw-heading">
              Giải pháp Chuỗi cung ứng Toàn cầu🚛 
            </p>
            <p className="tw-sub-heading">
              Chúng tôi lập kế hoạch, triển khai và kiểm soát việc di chuyển 
              và lưu trữ hàng hóa trong chuỗi cung ứng, từ điểm xuất phát 
              đến điểm tiêu thụ.
            </p>
          </div>
        </div>
      </div>
      <hr/>
    </div>
  ) 
}
export default TopWrapper;
