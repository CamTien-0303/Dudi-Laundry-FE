import { WashingMachine, Zap, Droplets, Wind } from 'lucide-react';
import { Card, PageHeader, StatusBadge, ProgressBar } from '../../components/common';

export default function StoreOperations() {
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <PageHeader
        title="Vận hành"
        description="Theo dõi trạng thái máy giặt và quy trình vận hành."
        breadcrumb={[
          { label: 'Cửa hàng', to: '/store/dashboard' },
          { label: 'Vận hành' },
        ]}
      />

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-foreground">Trạng thái máy giặt</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card icon={<WashingMachine size={20} />} title="Máy giặt #1">
            <div className="flex flex-col gap-3">
              <StatusBadge label="Đang chạy" variant="info" />
              <ProgressBar value={65} variant="info" />
              <p className="text-xs text-muted/80">Còn 25 phút</p>
            </div>
          </Card>
          <Card icon={<WashingMachine size={20} />} title="Máy giặt #2">
            <div className="flex flex-col gap-3">
              <StatusBadge label="Sẵn sàng" variant="success" />
              <p className="text-xs text-muted/80">Sẵn sàng nhận đồ</p>
            </div>
          </Card>
          <Card icon={<WashingMachine size={20} />} title="Máy giặt #3">
            <div className="flex flex-col gap-3">
              <StatusBadge label="Bảo trì" variant="warning" />
              <p className="text-xs text-muted/80">Đang bảo trì định kỳ</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <h2 className="text-sm font-bold text-foreground">Máy sấy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card icon={<Wind size={20} />} title="Máy sấy #1">
            <div className="flex flex-col gap-3">
              <StatusBadge label="Đang chạy" variant="info" />
              <ProgressBar value={80} variant="info" />
              <p className="text-xs text-muted/80">Còn 10 phút</p>
            </div>
          </Card>
          <Card icon={<Wind size={20} />} title="Máy sấy #2">
            <div className="flex flex-col gap-3">
              <StatusBadge label="Sẵn sàng" variant="success" />
              <p className="text-xs text-muted/80">Sẵn sàng nhận đồ</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <h2 className="text-sm font-bold text-foreground">Tài nguyên</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card icon={<Droplets size={20} />} title="Nước giặt">
            <div className="flex flex-col gap-3">
              <ProgressBar value={72} variant="success" />
              <p className="text-xs text-muted/80">72% — Còn đủ dùng 5 ngày</p>
            </div>
          </Card>
          <Card icon={<Zap size={20} />} title="Nước xả">
            <div className="flex flex-col gap-3">
              <ProgressBar value={30} variant="warning" />
              <p className="text-xs text-muted/80">30% — Cần bổ sung sớm</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
