import { useLocation } from 'react-router';
import PageHeader from '../components/common/PageHeader';
import EmptyState from '../components/common/EmptyState';

export default function GenericPlaceholderPage() {
  const location = useLocation();
  const path = location.pathname;

  const getPageDetails = () => {
    if (path.includes('customers')) {
      return { title: 'Quản lý khách hàng', desc: 'Xem danh sách và thông tin khách hàng thành viên.' };
    }
    if (path.includes('inventory')) {
      return { title: 'Kho vật tư', desc: 'Theo dõi nước giặt, nước xả và phụ liệu giặt ủi.' };
    }
    if (path.includes('staff')) {
      return { title: 'Nhân sự', desc: 'Quản lý lịch ca làm việc và phân quyền nhân viên.' };
    }
    if (path.includes('reports')) {
      return { title: 'Báo cáo doanh thu', desc: 'Thống kê kết quả kinh doanh và hiệu suất vận hành.' };
    }
    if (path.includes('settings')) {
      return { title: 'Cài đặt hệ thống', desc: 'Điều chỉnh cấu hình, bảng giá dịch vụ và thông tin cửa hàng.' };
    }
    if (path.includes('users')) {
      return { title: 'Quản lý người dùng', desc: 'Xem danh sách tài khoản phân quyền trên toàn hệ thống.' };
    }
    if (path.includes('profile')) {
      return { title: 'Tài khoản cá nhân', desc: 'Cập nhật thông tin bảo mật và hồ sơ cá nhân.' };
    }
    return { title: 'Đang phát triển', desc: 'Tính năng này đang được thiết kế và phát triển.' };
  };

  const details = getPageDetails();

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <PageHeader
        title={details.title}
        description={details.desc}
      />
      <div className="bg-surface border border-border/80 rounded-xl p-8 shadow-sm">
        <EmptyState
          title="Chưa khả dụng"
          message="Tính năng đang được phát triển trong giai đoạn tiếp theo của DUDI Laundry."
        />
      </div>
    </div>
  );
}
