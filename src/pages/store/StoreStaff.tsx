import { useState } from 'react';
import {
  Plus,
  Key,
  UserCheck,
  Search,
  Clock,
  Lock,
  Unlock,
  FileText,
  Building,
  ShieldCheck,
  SlidersHorizontal
} from 'lucide-react';
import { PageHeader, Modal, ConfirmDialog } from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface StaffMember {
  id: string;
  name: string;
  avatar: string; // Emoji representing avatar
  phone: string;
  email: string;
  username: string;
  branch: 'Chi nhánh Quận 7' | 'Chi nhánh Quận 1';
  role: 'Thu ngân' | 'Thợ giặt' | 'Shipper' | 'Quản lý chi nhánh';
  status: 'Đang làm việc' | 'Đang nghỉ' | 'Đã khóa';
}

interface ActivityLog {
  id: string;
  time: string;
  operator: string;
  operatorName: string;
  branch: string;
  action: string;
  target: string;
  detail: string;
}

const INITIAL_STAFF: StaffMember[] = [
  { id: 'NV-001', name: 'Nguyễn Văn An', avatar: '👨‍💼', phone: '0912345678', email: 'an.nv@dudi.vn', username: 'an.nv', branch: 'Chi nhánh Quận 7', role: 'Quản lý chi nhánh', status: 'Đang làm việc' },
  { id: 'NV-002', name: 'Trần Thị Bình', avatar: '👩‍🍳', phone: '0987654321', email: 'binh.tt@dudi.vn', username: 'binh.tt', branch: 'Chi nhánh Quận 7', role: 'Thu ngân', status: 'Đang làm việc' },
  { id: 'NV-003', name: 'Lê Văn Cường', avatar: '👨‍🔧', phone: '0909998887', email: 'cuong.lv@dudi.vn', username: 'cuong.lv', branch: 'Chi nhánh Quận 1', role: 'Thợ giặt', status: 'Đang nghỉ' },
  { id: 'NV-004', name: 'Phạm Minh Đức', avatar: '🛵', phone: '0933334444', email: 'duc.pm@dudi.vn', username: 'duc.pm', branch: 'Chi nhánh Quận 1', role: 'Shipper', status: 'Đang làm việc' },
  { id: 'NV-005', name: 'Hoàng Thị Em', avatar: '👩‍💼', phone: '0944455566', email: 'em.ht@dudi.vn', username: 'em.ht', branch: 'Chi nhánh Quận 7', role: 'Thợ giặt', status: 'Đã khóa' },
  { id: 'NV-006', name: 'Vũ Văn Phương', avatar: '👨‍🍳', phone: '0955566677', email: 'phuong.vv@dudi.vn', username: 'phuong.vv', branch: 'Chi nhánh Quận 1', role: 'Thu ngân', status: 'Đang làm việc' }
];

const INITIAL_LOGS: ActivityLog[] = [
  { id: 'LOG-001', time: '2026-07-17 09:15', operator: 'an.nv', operatorName: 'Nguyễn Văn An', branch: 'Chi nhánh Quận 7', action: 'Xóa đơn hàng', target: 'Đơn hàng #105', detail: 'Nhân viên A xóa đơn hàng #105' },
  { id: 'LOG-002', time: '2026-07-17 09:20', operator: 'binh.tt', operatorName: 'Trần Thị Bình', branch: 'Chi nhánh Quận 7', action: 'Thay đổi giá', target: 'Bảng giá dịch vụ', detail: 'Nhân viên B thay đổi giá dịch vụ' },
  { id: 'LOG-003', time: '2026-07-17 09:25', operator: 'cuong.lv', operatorName: 'Lê Văn Cường', branch: 'Chi nhánh Quận 1', action: 'Cập nhật trạng thái', target: 'Đơn hàng #DL-002', detail: 'Nhân viên C cập nhật trạng thái đơn #DL-002' }
];

export default function StoreStaff() {
  const { toast } = useToast();

  // Core database state
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);

  // Simulation: Logged-in user simulation
  // Options: 
  // 'super.admin' -> region manager (full access, views all branches)
  // 'an.nv' -> branch manager for Dist 7 (locked to Dist 7 data, cannot edit self)
  // 'duc.pm' -> shipper for Dist 1 (locked to Dist 1, cannot write/add/lock, triggers error toast)
  const [loggedInUser, setLoggedInUser] = useState<'super.admin' | 'an.nv' | 'duc.pm'>('super.admin');

  // Tabs navigation
  const [activeTab, setActiveTab] = useState<'list' | 'roles' | 'logs'>('list');

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('Tất cả');
  const [roleFilter, setRoleFilter] = useState<string>('Tất cả');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');

  // Activity logs specific search filter
  const [logsSearchUser, setLogsSearchUser] = useState<string | null>(null);

  // Modals visibility states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isConfirmLockOpen, setIsConfirmLockOpen] = useState(false);

  // Form states: Add / Edit Staff
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formAvatar, setFormAvatar] = useState('👩‍💼');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formBranch, setFormBranch] = useState<'Chi nhánh Quận 7' | 'Chi nhánh Quận 1'>('Chi nhánh Quận 7');
  const [formRole, setFormRole] = useState<'Thu ngân' | 'Thợ giặt' | 'Shipper' | 'Quản lý chi nhánh'>('Thu ngân');
  const [formStatus, setFormStatus] = useState<'Đang làm việc' | 'Đang nghỉ' | 'Đã khóa'>('Đang làm việc');

  // Lock account confirm details
  const [lockTargetId, setLockTargetId] = useState<string | null>(null);

  // Validation errors
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  // Emojis for avatars list selection
  const AVATARS_OPTIONS = ['👨‍💼', '👩‍🍳', '👨‍🔧', '🛵', '👩‍💼', '👨‍🍳', '👩‍🎨', '👨‍🎨'];

  // Resolve details of simulation logged-in user
  const loggedInStaffDetails = staff.find(s => s.username === loggedInUser) || {
    name: 'Quản trị viên vùng',
    role: 'Quản lý vùng',
    branch: 'Tất cả'
  };

  // Helper check: does current simulated user have write access?
  // Shipper has no write access
  const hasWriteAccess = () => {
    if (loggedInUser === 'duc.pm') return false;
    return true;
  };

  // Check if simulated user can perform actions
  // If not, toast error and return false
  const checkWritePermission = () => {
    if (!hasWriteAccess()) {
      toast('Bạn không có quyền truy cập vào chức năng này. Vui lòng liên hệ quản trị viên.', 'error');
      return false;
    }
    return true;
  };

  // Check self-modification constraints
  // If target employee is the logged-in user, block it!
  const isSelfAction = (targetUsername: string) => {
    if (targetUsername === loggedInUser) {
      toast('Bạn không thể tự thay đổi quyền hạn hoặc tự khóa tài khoản của chính mình.', 'error');
      return true;
    }
    return false;
  };

  // Branch isolation filtering logic
  const getBranchIsolatedStaff = () => {
    return staff.filter(s => {
      if (loggedInUser === 'an.nv') {
        // District 7 manager only sees Quận 7
        return s.branch === 'Chi nhánh Quận 7';
      }
      if (loggedInUser === 'duc.pm') {
        // Shipper in District 1 only sees Quận 1
        return s.branch === 'Chi nhánh Quận 1';
      }
      // Super admin sees everything
      return true;
    });
  };

  // Apply search & filters on branch isolated list
  const filteredStaff = getBranchIsolatedStaff().filter(s => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      s.name.toLowerCase().includes(query) ||
      s.phone.includes(query) ||
      s.username.toLowerCase().includes(query);

    const matchesBranch = branchFilter === 'Tất cả' || s.branch === branchFilter;
    const matchesRole = roleFilter === 'Tất cả' || s.role === roleFilter;
    const matchesStatus = statusFilter === 'Tất cả' || s.status === statusFilter;

    return matchesSearch && matchesBranch && matchesRole && matchesStatus;
  });

  // Filter logs list
  const filteredLogs = logs.filter(l => {
    if (logsSearchUser) {
      return l.operator === logsSearchUser;
    }
    return true;
  });

  // Handle open Add Employee modal
  const handleOpenAddStaff = () => {
    if (!checkWritePermission()) return;
    setEditingStaffId(null);
    setFormName('');
    setFormAvatar('👨‍💼');
    setFormPhone('');
    setFormEmail('');
    setFormUsername('');
    setFormPassword('Dudi@1234');
    // Lock branch if branch manager is creating
    setFormBranch(loggedInUser === 'an.nv' ? 'Chi nhánh Quận 7' : 'Chi nhánh Quận 7');
    setFormRole('Thu ngân');
    setFormStatus('Đang làm việc');

    // Reset validation errors
    setNameError('');
    setPhoneError('');
    setUsernameError('');

    setIsAddEditModalOpen(true);
  };

  // Handle open Edit Employee modal
  const handleOpenEditStaff = (member: StaffMember) => {
    if (!checkWritePermission()) return;
    if (isSelfAction(member.username)) return;

    setEditingStaffId(member.id);
    setFormName(member.name);
    setFormAvatar(member.avatar);
    setFormPhone(member.phone);
    setFormEmail(member.email);
    setFormUsername(member.username);
    setFormPassword('••••••••'); // Hidden
    setFormBranch(member.branch);
    setFormRole(member.role);
    setFormStatus(member.status);

    setNameError('');
    setPhoneError('');
    setUsernameError('');

    setIsAddEditModalOpen(true);
  };

  // Submit Add / Edit Staff
  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkWritePermission()) return;

    let hasValError = false;
    setNameError('');
    setPhoneError('');
    setUsernameError('');

    if (!formName.trim()) {
      setNameError('Họ tên không được để trống.');
      hasValError = true;
    }

    if (!formPhone.trim()) {
      setPhoneError('Số điện thoại không được để trống.');
      hasValError = true;
    }

    if (!formUsername.trim()) {
      setUsernameError('Username không được để trống.');
      hasValError = true;
    } else {
      // Validate unique username (must check if it already exists for others)
      const usernameExists = staff.some(
        s => s.username.toLowerCase().trim() === formUsername.toLowerCase().trim() && s.id !== editingStaffId
      );
      if (usernameExists) {
        setUsernameError('Username này đã được sử dụng bởi nhân viên khác.');
        hasValError = true;
      }
    }

    if (hasValError) return;

    if (editingStaffId) {
      // Edit
      setStaff(prev =>
        prev.map(s =>
          s.id === editingStaffId
            ? {
                ...s,
                name: formName.trim(),
                avatar: formAvatar,
                phone: formPhone.trim(),
                email: formEmail.trim(),
                username: formUsername.toLowerCase().trim(),
                branch: formBranch,
                role: formRole,
                status: formStatus
              }
            : s
        )
      );

      // Append edit log
      const now = new Date();
      const formatTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newLog: ActivityLog = {
        id: `LOG-${Date.now()}`,
        time: formatTime,
        operator: loggedInUser,
        operatorName: loggedInStaffDetails.name,
        branch: loggedInStaffDetails.branch === 'Tất cả' ? 'Tổng công ty' : loggedInStaffDetails.branch,
        action: 'Sửa nhân viên',
        target: formUsername.toLowerCase().trim(),
        detail: `Cập nhật thông tin tài khoản nhân viên ${formName.trim()}`
      };
      setLogs(prev => [...prev, newLog]);

      toast('Đã cập nhật thông tin nhân viên thành công.', 'success');
    } else {
      // Add
      const newMember: StaffMember = {
        id: `NV-${String(staff.length + 1).padStart(3, '0')}`,
        name: formName.trim(),
        avatar: formAvatar,
        phone: formPhone.trim(),
        email: formEmail.trim(),
        username: formUsername.toLowerCase().trim(),
        branch: formBranch,
        role: formRole,
        status: formStatus
      };

      setStaff(prev => [...prev, newMember]);

      // Append add log
      const now = new Date();
      const formatTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newLog: ActivityLog = {
        id: `LOG-${Date.now()}`,
        time: formatTime,
        operator: loggedInUser,
        operatorName: loggedInStaffDetails.name,
        branch: loggedInStaffDetails.branch === 'Tất cả' ? 'Tổng công ty' : loggedInStaffDetails.branch,
        action: 'Thêm nhân viên',
        target: formUsername.toLowerCase().trim(),
        detail: `Tạo mới tài khoản nhân viên ${formName.trim()}`
      };
      setLogs(prev => [...prev, newLog]);

      toast('Thêm mới nhân viên thành công.', 'success');
    }

    setIsAddEditModalOpen(false);
  };

  // Reset password action
  const handleResetPassword = (member: StaffMember) => {
    if (!checkWritePermission()) return;
    if (isSelfAction(member.username)) return;

    toast('Mật khẩu mới đã được tạo và gửi thông báo cho nhân viên.', 'success');

    // Append log
    const now = new Date();
    const formatTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      time: formatTime,
      operator: loggedInUser,
      operatorName: loggedInStaffDetails.name,
      branch: loggedInStaffDetails.branch === 'Tất cả' ? 'Tổng công ty' : loggedInStaffDetails.branch,
      action: 'Reset mật khẩu',
      target: member.username,
      detail: `Khởi tạo lại mật khẩu đăng nhập cho nhân viên ${member.name}`
    };
    setLogs(prev => [...prev, newLog]);
  };

  // Toggle Lock/Unlock confirmation trigger
  const handleToggleLockTrigger = (member: StaffMember) => {
    if (!checkWritePermission()) return;
    if (isSelfAction(member.username)) return;

    if (member.status === 'Đã khóa') {
      // Unlock directly
      setStaff(prev =>
        prev.map(s => (s.id === member.id ? { ...s, status: 'Đang làm việc' } : s))
      );
      toast('Đã mở khóa tài khoản nhân viên thành công.', 'success');

      // Append log
      const now = new Date();
      const formatTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newLog: ActivityLog = {
        id: `LOG-${Date.now()}`,
        time: formatTime,
        operator: loggedInUser,
        operatorName: loggedInStaffDetails.name,
        branch: loggedInStaffDetails.branch === 'Tất cả' ? 'Tổng công ty' : loggedInStaffDetails.branch,
        action: 'Mở khóa tài khoản',
        target: member.username,
        detail: `Mở khóa truy cập cho tài khoản nhân viên ${member.name}`
      };
      setLogs(prev => [...prev, newLog]);
    } else {
      // Show confirmation dialog for Lock
      setLockTargetId(member.id);
      setIsConfirmLockOpen(true);
    }
  };

  // Confirm Lock action
  const handleConfirmLock = () => {
    if (!lockTargetId) return;

    const member = staff.find(s => s.id === lockTargetId);
    if (!member) return;

    setStaff(prev =>
      prev.map(s => (s.id === lockTargetId ? { ...s, status: 'Đã khóa' } : s))
    );

    // Append log
    const now = new Date();
    const formatTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      time: formatTime,
      operator: loggedInUser,
      operatorName: loggedInStaffDetails.name,
      branch: loggedInStaffDetails.branch === 'Tất cả' ? 'Tổng công ty' : loggedInStaffDetails.branch,
      action: 'Khóa tài khoản',
      target: member.username,
      detail: `Khóa truy cập tài khoản nhân viên ${member.name}`
    };
    setLogs(prev => [...prev, newLog]);

    setIsConfirmLockOpen(false);
    setLockTargetId(null);
    toast('Tài khoản đã bị khóa và đăng xuất khỏi hệ thống.', 'success');
  };

  // View logs for a specific employee
  const handleViewEmployeeLogs = (username: string) => {
    setLogsSearchUser(username);
    setActiveTab('logs');
    toast(`Hiển thị nhật ký hoạt động của tài khoản: ${username}`, 'info');
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800">
      
      {/* Title Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <PageHeader
          title="Quản lý nhân sự và phân quyền"
          description="Quản lý tài khoản, vai trò và lịch sử hoạt động của nhân viên."
        />
        
        {/* Right controls: current simulated user & Add button */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-end sm:self-auto">
          {/* Simulated User Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none">Mô phỏng TK:</span>
            <select
              value={loggedInUser}
              onChange={(e) => {
                setLoggedInUser(e.target.value as any);
                setLogsSearchUser(null); // Clear filter
                toast(`Chuyển mô phỏng sang người dùng: ${e.target.value}`, 'info');
              }}
              className="bg-transparent border-none outline-none font-bold text-slate-700 cursor-pointer"
            >
              <option value="super.admin">super.admin (Quản lý vùng)</option>
              <option value="an.nv">an.nv (Quản lý Quận 7)</option>
              <option value="duc.pm">duc.pm (Shipper Quận 1)</option>
            </select>
          </div>

          {activeTab === 'list' && (
            <button
              type="button"
              onClick={handleOpenAddStaff}
              className="flex items-center gap-1.5 font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl shadow-sm transition-colors cursor-pointer border-none"
            >
              <Plus size={15} /> Thêm nhân viên
            </button>
          )}
        </div>
      </div>

      {/* License / Account count limits alert bar */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5 text-xs text-blue-900 leading-relaxed font-semibold">
          <span className="text-base select-none">👥</span>
          <div>
            <span>Số tài khoản nhân viên đã sử dụng: <strong>{staff.length} / 10 tài khoản</strong></span>
            <span className="text-[10px] text-blue-500 font-medium ml-2 select-none">(Theo giới hạn của gói Premium)</span>
          </div>
        </div>
        <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-150">Premium</span>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-4">
        {[
          { key: 'list', label: 'Danh sách nhân viên' },
          { key: 'roles', label: 'Thiết lập vai trò' },
          { key: 'logs', label: 'Nhật ký hoạt động' }
        ].map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-2 px-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === t.key
                ? 'border-blue-600 text-blue-600 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab contents */}
      <div className="mt-1 flex flex-col gap-6">
        
        {/* Tab 1: Danh sách nhân viên */}
        {activeTab === 'list' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Filter controls */}
            <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs">
              
              {/* Search input */}
              <div className="relative flex-1 w-full max-w-sm">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                  <Search size={15} />
                </span>
                <input
                  type="text"
                  placeholder="Tìm theo họ tên, SĐT hoặc username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all"
                />
              </div>

              {/* Advanced select filters */}
              <div className="flex flex-wrap gap-3 w-full xl:w-auto mt-2 xl:mt-0 justify-end">
                {/* Branch */}
                {loggedInUser === 'super.admin' && (
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-655">
                    <Building size={13} className="text-slate-400" />
                    <select
                      value={branchFilter}
                      onChange={(e) => setBranchFilter(e.target.value)}
                      className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="Tất cả">Tất cả chi nhánh</option>
                      <option value="Chi nhánh Quận 7">Quận 7</option>
                      <option value="Chi nhánh Quận 1">Quận 1</option>
                    </select>
                  </div>
                )}

                {/* Role */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-655">
                  <UserCheck size={13} className="text-slate-400" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="Tất cả">Tất cả vai trò</option>
                    <option value="Thu ngân">Thu ngân</option>
                    <option value="Thợ giặt">Thợ giặt</option>
                    <option value="Shipper">Shipper</option>
                    <option value="Quản lý chi nhánh">Quản lý chi nhánh</option>
                  </select>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-655">
                  <SlidersHorizontal size={13} className="text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="Tất cả">Tất cả trạng thái</option>
                    <option value="Đang làm việc">Đang làm việc</option>
                    <option value="Đang nghỉ">Đang nghỉ</option>
                    <option value="Đã khóa">Đã khóa</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bảng nhân viên */}
            <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl bg-white shadow-sm">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-150">
                    <th className="py-3 px-5">Nhân viên / SĐT</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Chi nhánh</th>
                    <th className="py-3 px-4">Vai trò</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-5 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-xs">
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                        Không tìm thấy tài khoản nhân viên nào khớp bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((member) => {
                      const isLocked = member.status === 'Đã khóa';
                      return (
                        <tr
                          key={member.id}
                          className={`hover:bg-slate-50/50 transition-all ${
                            isLocked ? 'opacity-55 bg-slate-50/40 select-none' : ''
                          }`}
                        >
                          {/* Name / Avatar / Phone */}
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-3">
                              <span className="text-xl bg-slate-100 p-1.5 rounded-lg border border-slate-150 shrink-0">
                                {member.avatar}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-extrabold text-slate-900 leading-tight">
                                  {member.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold mt-0.5">
                                  SĐT: {member.phone}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Username */}
                          <td className="py-3 px-4 font-semibold text-slate-600">
                            {member.username}
                          </td>

                          {/* Branch */}
                          <td className="py-3 px-4 font-medium text-slate-655">
                            {member.branch}
                          </td>

                          {/* Role */}
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded px-2 py-0.5">
                              {member.role}
                            </span>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              member.status === 'Đang làm việc'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : member.status === 'Đang nghỉ'
                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                : 'bg-rose-50 text-rose-700 border-rose-100'
                            }`}>
                              {member.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-5 text-center">
                            <div className="flex flex-wrap items-center justify-center gap-2">
                              {/* Edit details */}
                              <button
                                type="button"
                                disabled={isLocked || !hasWriteAccess()}
                                onClick={() => handleOpenEditStaff(member)}
                                className={`px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-600 rounded-lg border border-slate-200 font-bold text-[10px] transition-colors cursor-pointer ${
                                  (isLocked || !hasWriteAccess()) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                Sửa
                              </button>

                              {/* Reset password */}
                              <button
                                type="button"
                                disabled={isLocked || !hasWriteAccess()}
                                onClick={() => handleResetPassword(member)}
                                className={`p-1.5 bg-white hover:bg-slate-50 text-slate-500 hover:text-blue-600 rounded-lg border border-slate-200 transition-colors cursor-pointer ${
                                  (isLocked || !hasWriteAccess()) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                title="Reset mật khẩu"
                              >
                                <Key size={12} />
                              </button>

                              {/* Lock / Unlock */}
                              <button
                                type="button"
                                disabled={!hasWriteAccess()}
                                onClick={() => handleToggleLockTrigger(member)}
                                className={`p-1.5 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors cursor-pointer ${
                                  isLocked 
                                    ? 'text-emerald-600 hover:text-emerald-700' 
                                    : 'text-rose-600 hover:text-rose-700'
                                } ${!hasWriteAccess() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                              >
                                {isLocked ? <Unlock size={12} /> : <Lock size={12} />}
                              </button>

                              {/* View logs history */}
                              <button
                                type="button"
                                onClick={() => handleViewEmployeeLogs(member.username)}
                                className="p-1.5 bg-white hover:bg-slate-50 text-slate-500 hover:text-indigo-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                title="Xem nhật ký hoạt động"
                              >
                                <FileText size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Thiết lập vai trò */}
        {activeTab === 'roles' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-5 animate-fadeIn">
            
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600" /> Bảng ma trận quyền hạn vai trò nhân viên
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 font-semibold">
                Xem cấu hình chi tiết phân bổ quyền lợi cho 4 nhóm nhân sự trong hệ thống.
              </p>
            </div>

            <div className="overflow-x-auto w-full border border-slate-150 rounded-xl bg-white">
              <table className="w-full text-left border-collapse min-w-[700px] text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-150">
                    <th className="py-2.5 px-4 w-1/3">Quyền / Phạm vi chức năng</th>
                    <th className="py-2.5 px-4 text-center">Thu ngân</th>
                    <th className="py-2.5 px-4 text-center">Thợ giặt</th>
                    <th className="py-2.5 px-4 text-center">Shipper</th>
                    <th className="py-2.5 px-4 text-center">Quản lý chi nhánh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-semibold text-slate-700">
                  {/* Row 1: Tạo đơn / in hóa đơn */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      Tạo đơn, In hóa đơn & Nhận tiền đơn hàng
                    </td>
                    <td className="py-3 px-4 text-center text-emerald-600">✅ Bật</td>
                    <td className="py-3 px-4 text-center text-slate-300">❌ Không</td>
                    <td className="py-3 px-4 text-center text-slate-300">❌ Không</td>
                    <td className="py-3 px-4 text-center text-emerald-600">✅ Bật</td>
                  </tr>
                  
                  {/* Row 2: Sửa báo cáo doanh thu */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      Sửa báo cáo doanh thu & Dữ liệu tài chính
                    </td>
                    <td className="py-3 px-4 text-center text-rose-500">❌ Bị Chặn</td>
                    <td className="py-3 px-4 text-center text-slate-300">❌ Không</td>
                    <td className="py-3 px-4 text-center text-slate-300">❌ Không</td>
                    <td className="py-3 px-4 text-center text-emerald-600">✅ Bật (Chi nhánh)</td>
                  </tr>

                  {/* Row 3: Chỉ xem màn vận hành */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      Chỉ xem màn Vận hành và Cập nhật trạng thái giặt sấy
                    </td>
                    <td className="py-3 px-4 text-center text-slate-300">❌ Không</td>
                    <td className="py-3 px-4 text-center text-emerald-600">✅ Bật</td>
                    <td className="py-3 px-4 text-center text-slate-300">❌ Không</td>
                    <td className="py-3 px-4 text-center text-emerald-600">✅ Bật</td>
                  </tr>

                  {/* Row 4: Shipper lấy giao */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      Xem thông tin lấy/giao đồ & SĐT khách hàng cần giao
                    </td>
                    <td className="py-3 px-4 text-center text-slate-300">❌ Không</td>
                    <td className="py-3 px-4 text-center text-slate-300">❌ Không</td>
                    <td className="py-3 px-4 text-center text-emerald-600">✅ Bật (Giới hạn SĐT)</td>
                    <td className="py-3 px-4 text-center text-emerald-600">✅ Bật</td>
                  </tr>

                  {/* Row 5: Toàn quyền chi nhánh */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      Toàn quyền cấu hình, nhân sự và báo cáo trong chi nhánh
                    </td>
                    <td className="py-3 px-4 text-center text-rose-500">❌ Không</td>
                    <td className="py-3 px-4 text-center text-slate-300">❌ Không</td>
                    <td className="py-3 px-4 text-center text-slate-300">❌ Không</td>
                    <td className="py-3 px-4 text-center text-emerald-600">✅ Bật</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-2.5">
              <span className="text-xs select-none">👮</span>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                Bảng trên mô tả chi tiết chính sách phân quyền áp dụng trực tiếp trong hệ thống DUDI Laundry Platform. Nhân viên chỉ hoạt động đúng trong phạm vi chức năng được gán theo vai trò.
              </p>
            </div>

          </div>
        )}

        {/* Tab 3: Nhật ký hoạt động */}
        {activeTab === 'logs' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 flex-wrap gap-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock size={16} className="text-blue-500" /> Nhật ký hoạt động của nhân viên
              </h3>
              
              {/* Reset specific log filter */}
              {logsSearchUser && (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-150 px-2.5 py-1 rounded-lg text-xs font-semibold animate-fadeIn">
                  <span className="text-blue-800">Đang lọc tài khoản: <strong>{logsSearchUser}</strong></span>
                  <button
                    onClick={() => setLogsSearchUser(null)}
                    className="text-xs text-blue-500 hover:text-blue-800 font-bold border-none bg-transparent cursor-pointer"
                  >
                    [Xóa lọc]
                  </button>
                </div>
              )}
            </div>

            {/* Logs List Table */}
            <div className="overflow-x-auto w-full border border-slate-150 rounded-xl bg-white">
              <table className="w-full text-left border-collapse min-w-[700px] text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-150">
                    <th className="py-2.5 px-4 w-40">Thời gian</th>
                    <th className="py-2.5 px-4">Nhân viên</th>
                    <th className="py-2.5 px-4">Chi nhánh</th>
                    <th className="py-2.5 px-4">Hành động</th>
                    <th className="py-2.5 px-4">Đối tượng</th>
                    <th className="py-2.5 px-4">Nội dung chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-700">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                        Không ghi nhận nhật ký hoạt động nào khớp điều kiện.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2.5 px-4 text-slate-400 font-semibold">{log.time}</td>
                        <td className="py-2.5 px-4">
                          <span className="font-bold text-slate-900">{log.operatorName}</span>
                          <span className="text-[10px] text-slate-400 block font-bold">@{log.operator}</span>
                        </td>
                        <td className="py-2.5 px-4 font-medium">{log.branch}</td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold border border-slate-150">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-655">{log.target}</td>
                        <td className="py-2.5 px-4 text-slate-600 font-medium italic">"{log.detail}"</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

      {/* Modal: Thêm / Sửa nhân viên */}
      <Modal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        title={editingStaffId ? 'Cập nhật tài khoản nhân viên' : 'Thêm mới nhân viên'}
        size="md"
      >
        <form onSubmit={handleSaveStaff} className="flex flex-col gap-4 text-slate-800">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Họ tên */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Họ và tên <span className="text-rose-500">*</span></label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  if (e.target.value.trim()) setNameError('');
                }}
                className={`w-full bg-slate-50 border focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-850 outline-none transition-all ${
                  nameError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-400'
                }`}
              />
              {nameError && (
                <span className="text-[10px] font-bold text-rose-500">⚠️ {nameError}</span>
              )}
            </div>

            {/* SĐT */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Số điện thoại <span className="text-rose-500">*</span></label>
              <input
                type="text"
                placeholder="09xxxxxxxx"
                value={formPhone}
                onChange={(e) => {
                  setFormPhone(e.target.value.replace(/[^0-9]/g, ''));
                  if (e.target.value.trim()) setPhoneError('');
                }}
                className={`w-full bg-slate-50 border focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-850 outline-none transition-all ${
                  phoneError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-400'
                }`}
              />
              {phoneError && (
                <span className="text-[10px] font-bold text-rose-500">⚠️ {phoneError}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Địa chỉ Email</label>
              <input
                type="email"
                placeholder="email@dudi.vn"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-850 outline-none transition-all"
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Username <span className="text-rose-500">*</span></label>
              <input
                type="text"
                placeholder="ten.nv"
                value={formUsername}
                onChange={(e) => {
                  setFormUsername(e.target.value);
                  if (e.target.value.trim()) setUsernameError('');
                }}
                disabled={editingStaffId !== null} // Cannot change username on Edit
                className={`w-full bg-slate-50 border focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-850 outline-none transition-all ${
                  editingStaffId !== null ? 'opacity-60 cursor-not-allowed' : ''
                } ${usernameError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-400'}`}
              />
              {usernameError && (
                <span className="text-[10px] font-bold text-rose-500">⚠️ {usernameError}</span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Mật khẩu mặc định</label>
              <input
                type="text"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                disabled={editingStaffId !== null} // Only set on Add
                className={`w-full bg-slate-50 border focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-850 outline-none transition-all ${
                  editingStaffId !== null ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
            </div>

            {/* Avatar Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Chọn ảnh đại diện (Emoji)</label>
              <select
                value={formAvatar}
                onChange={(e) => setFormAvatar(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-850 outline-none transition-all"
              >
                {AVATARS_OPTIONS.map((av, idx) => (
                  <option key={idx} value={av}>{av} Biểu tượng {idx + 1}</option>
                ))}
              </select>
            </div>

            {/* Chi nhánh */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Chi nhánh làm việc</label>
              <select
                value={formBranch}
                onChange={(e) => setFormBranch(e.target.value as any)}
                disabled={loggedInUser === 'an.nv'} // Branch manager locked to Quận 7
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-850 outline-none transition-all"
              >
                <option value="Chi nhánh Quận 7">Chi nhánh Quận 7</option>
                <option value="Chi nhánh Quận 1">Chi nhánh Quận 1</option>
              </select>
            </div>

            {/* Vai trò */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Vai trò / Chức danh</label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-850 outline-none transition-all"
              >
                <option value="Thu ngân">Thu ngân</option>
                <option value="Thợ giặt">Thợ giặt</option>
                <option value="Shipper">Shipper</option>
                <option value="Quản lý chi nhánh">Quản lý chi nhánh</option>
              </select>
            </div>

            {/* Trạng thái */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Trạng thái nhân sự</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-850 outline-none transition-all"
              >
                <option value="Đang làm việc">Đang làm việc</option>
                <option value="Đang nghỉ">Đang nghỉ</option>
                <option value="Đã khóa">Đã khóa</option>
              </select>
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end mt-3 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setIsAddEditModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer text-slate-650 bg-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Lưu thông tin
            </button>
          </div>

        </form>
      </Modal>

      {/* Confirm Lock Dialog */}
      <ConfirmDialog
        isOpen={isConfirmLockOpen}
        onClose={() => {
          setIsConfirmLockOpen(false);
          setLockTargetId(null);
        }}
        onConfirm={handleConfirmLock}
        title="Khóa tài khoản nhân viên"
        message="Bạn có chắc chắn muốn khóa tài khoản này? Người dùng sẽ bị đăng xuất khỏi hệ thống ngay lập tức."
        confirmText="Đồng ý khóa"
        cancelText="Quay lại"
        variant="danger"
      />

    </div>
  );
}
