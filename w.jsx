import React, { useState, useEffect } from 'react';
import { Users, Receipt, User, Building2, BarChart3, Bell, Gift, Settings, Home, Plus, Search, Filter, Calendar, CreditCard, Printer, MessageCircle, Check, Clock, AlertCircle, Star, Edit, Trash2, Eye } from 'lucide-react';

const LaundryManagementSystem = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({ name: 'أحمد محمد', role: 'مالك', branch: 'الفرع الرئيسي' });
  const [darkMode, setDarkMode] = useState(false);

  // بيانات وهمية للنظام
  const [customers, setCustomers] = useState([
    { id: 1, name: 'محمد أحمد', phone: '0501234567', totalOrders: 15, points: 120, lastVisit: '2025-07-28' },
    { id: 2, name: 'فاطمة علي', phone: '0507654321', totalOrders: 8, points: 85, lastVisit: '2025-07-27' },
    { id: 3, name: 'خالد سعد', phone: '0509876543', totalOrders: 23, points: 200, lastVisit: '2025-07-26' }
  ]);

  const [orders, setOrders] = useState([
    { id: 1001, customerId: 1, customerName: 'محمد أحمد', services: ['غسيل عادي', 'كوي'], total: 45, status: 'قيد التنفيذ', paymentMethod: 'كاش', date: '2025-07-28', dueDate: '2025-07-30' },
    { id: 1002, customerId: 2, customerName: 'فاطمة علي', services: ['تنظيف جاف'], total: 80, status: 'جاهز للاستلام', paymentMethod: 'شبكة', date: '2025-07-27', dueDate: '2025-07-29' },
    { id: 1003, customerId: 3, customerName: 'خالد سعد', services: ['غسيل عادي'], total: 25, status: 'مكتمل', paymentMethod: 'تحويل بنكي', date: '2025-07-26', dueDate: '2025-07-28' }
  ]);

  const [employees, setEmployees] = useState([
    { id: 1, name: 'سعد أحمد', role: 'كاشير', branch: 'الفرع الرئيسي', status: 'نشط' },
    { id: 2, name: 'نورا محمد', role: 'استقبال', branch: 'فرع الشمال', status: 'نشط' },
    { id: 3, name: 'عبدالله علي', role: 'مدير فرع', branch: 'فرع الجنوب', status: 'إجازة' }
  ]);

  const [branches, setBranches] = useState([
    { id: 1, name: 'الفرع الرئيسي', location: 'حي الملك فهد', dailyRevenue: 1250, dailyOrders: 28, manager: 'أحمد محمد' },
    { id: 2, name: 'فرع الشمال', location: 'حي النزهة', dailyRevenue: 890, dailyOrders: 19, manager: 'نورا محمد' },
    { id: 3, name: 'فرع الجنوب', location: 'حي الواحة', dailyRevenue: 1100, dailyOrders: 24, manager: 'عبدالله علي' }
  ]);

  const services = [
    { name: 'غسيل عادي', price: 15 },
    { name: 'غسيل سريع', price: 25 },
    { name: 'كوي', price: 10 },
    { name: 'تنظيف جاف', price: 35 },
    { name: 'غسيل الستائر', price: 50 },
    { name: 'غسيل السجاد', price: 80 }
  ];

  const [newOrder, setNewOrder] = useState({
    customerId: '',
    services: [],
    total: 0,
    paymentMethod: 'كاش',
    notes: ''
  });

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');

  // إحصائيات اليوم
  const todayStats = {
    totalRevenue: 3240,
    totalOrders: 71,
    completedOrders: 45,
    pendingOrders: 26,
    newCustomers: 8
  };

  // تبديل الوضع الليلي
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // إضافة خدمة للطلب الجديد
  const addServiceToOrder = (service) => {
    const updatedServices = [...newOrder.services, service.name];
    const updatedTotal = newOrder.total + service.price;
    setNewOrder({
      ...newOrder,
      services: updatedServices,
      total: updatedTotal
    });
  };

  // إزالة خدمة من الطلب
  const removeServiceFromOrder = (index) => {
    const updatedServices = [...newOrder.services];
    const removedService = updatedServices.splice(index, 1);
    const servicePrice = services.find(s => s.name === removedService[0]).price;
    setNewOrder({
      ...newOrder,
      services: updatedServices,
      total: newOrder.total - servicePrice
    });
  };

  // إنشاء طلب جديد
  const createNewOrder = () => {
    if (newOrder.customerId && newOrder.services.length > 0) {
      const customer = customers.find(c => c.id === parseInt(newOrder.customerId));
      const order = {
        id: orders.length + 1001,
        customerId: parseInt(newOrder.customerId),
        customerName: customer.name,
        services: newOrder.services,
        total: newOrder.total,
        status: 'قيد التنفيذ',
        paymentMethod: newOrder.paymentMethod,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: newOrder.notes
      };
      
      setOrders([...orders, order]);
      setNewOrder({ customerId: '', services: [], total: 0, paymentMethod: 'كاش', notes: '' });
      setShowNewOrderModal(false);
      
      // إضافة نقاط للعميل
      const updatedCustomers = customers.map(c => 
        c.id === parseInt(newOrder.customerId) 
          ? { ...c, points: c.points + Math.floor(newOrder.total / 10), totalOrders: c.totalOrders + 1 }
          : c
      );
      setCustomers(updatedCustomers);
    }
  };

  // إضافة عميل جديد
  const addNewCustomer = () => {
    if (newCustomer.name && newCustomer.phone) {
      const customer = {
        id: customers.length + 1,
        name: newCustomer.name,
        phone: newCustomer.phone,
        address: newCustomer.address,
        totalOrders: 0,
        points: 0,
        lastVisit: new Date().toISOString().split('T')[0]
      };
      
      setCustomers([...customers, customer]);
      setNewCustomer({ name: '', phone: '', address: '' });
      setShowNewCustomerModal(false);
    }
  };

  // تحديث حالة الطلب
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  // لوحة التحكم الرئيسية
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-900'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-75">إجمالي الإيرادات اليوم</p>
              <p className="text-2xl font-bold">{todayStats.totalRevenue} ر.س</p>
            </div>
            <CreditCard className="w-8 h-8 opacity-75" />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-green-50 text-green-900'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-75">إجمالي الطلبات</p>
              <p className="text-2xl font-bold">{todayStats.totalOrders}</p>
            </div>
            <Receipt className="w-8 h-8 opacity-75" />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-yellow-50 text-yellow-900'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-75">طلبات مكتملة</p>
              <p className="text-2xl font-bold">{todayStats.completedOrders}</p>
            </div>
            <Check className="w-8 h-8 opacity-75" />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-orange-50 text-orange-900'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-75">طلبات معلقة</p>
              <p className="text-2xl font-bold">{todayStats.pendingOrders}</p>
            </div>
            <Clock className="w-8 h-8 opacity-75" />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-purple-50 text-purple-900'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-75">عملاء جدد</p>
              <p className="text-2xl font-bold">{todayStats.newCustomers}</p>
            </div>
            <User className="w-8 h-8 opacity-75" />
          </div>
        </div>
      </div>

      {/* الطلبات الحديثة */}
      <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">الطلبات الحديثة</h3>
          <button
            onClick={() => setShowNewOrderModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={16} />
            طلب جديد
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="text-right py-2">رقم الطلب</th>
                <th className="text-right py-2">العميل</th>
                <th className="text-right py-2">الخدمات</th>
                <th className="text-right py-2">المبلغ</th>
                <th className="text-right py-2">الحالة</th>
                <th className="text-right py-2">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <td className="py-3">#{order.id}</td>
                  <td className="py-3">{order.customerName}</td>
                  <td className="py-3">{order.services.join(', ')}</td>
                  <td className="py-3">{order.total} ر.س</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'مكتمل' ? 'bg-green-100 text-green-800' :
                      order.status === 'جاهز للاستلام' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-500 hover:text-green-700">
                        <Printer size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // إدارة الطلبات
  const OrdersManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الطلبات</h2>
        <button
          onClick={() => setShowNewOrderModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus size={16} />
          طلب جديد
        </button>
      </div>

      {/* فلاتر البحث */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث بالاسم أو رقم الطلب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pr-10 pl-3 py-2 border rounded-lg ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <select 
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className={`px-3 py-2 border rounded-lg ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
          >
            <option value="all">جميع الفروع</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
          
          <select className={`px-3 py-2 border rounded-lg ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
          }`}>
            <option value="all">جميع الحالات</option>
            <option value="pending">قيد التنفيذ</option>
            <option value="ready">جاهز للاستلام</option>
            <option value="completed">مكتمل</option>
          </select>
        </div>
      </div>

      {/* قائمة الطلبات */}
      <div className={`rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="text-right py-3 px-4">رقم الطلب</th>
                <th className="text-right py-3 px-4">العميل</th>
                <th className="text-right py-3 px-4">الهاتف</th>
                <th className="text-right py-3 px-4">الخدمات</th>
                <th className="text-right py-3 px-4">المبلغ</th>
                <th className="text-right py-3 px-4">طريقة الدفع</th>
                <th className="text-right py-3 px-4">الحالة</th>
                <th className="text-right py-3 px-4">تاريخ الاستلام</th>
                <th className="text-right py-3 px-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const customer = customers.find(c => c.id === order.customerId);
                return (
                  <tr key={order.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <td className="py-3 px-4 font-mono">#{order.id}</td>
                    <td className="py-3 px-4">{order.customerName}</td>
                    <td className="py-3 px-4">{customer?.phone}</td>
                    <td className="py-3 px-4">{order.services.join(', ')}</td>
                    <td className="py-3 px-4 font-semibold">{order.total} ر.س</td>
                    <td className="py-3 px-4">{order.paymentMethod}</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs ${
                          order.status === 'مكتمل' ? 'bg-green-100 text-green-800' :
                          order.status === 'جاهز للاستلام' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="قيد التنفيذ">قيد التنفيذ</option>
                        <option value="جاهز للاستلام">جاهز للاستلام</option>
                        <option value="مكتمل">مكتمل</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">{order.dueDate}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="text-blue-500 hover:text-blue-700" title="عرض">
                          <Eye size={16} />
                        </button>
                        <button className="text-green-500 hover:text-green-700" title="طباعة">
                          <Printer size={16} />
                        </button>
                        <button className="text-purple-500 hover:text-purple-700" title="واتساب">
                          <MessageCircle size={16} />
                        </button>
                        <button className="text-orange-500 hover:text-orange-700" title="تعديل">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // إدارة العملاء
  const CustomersManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة العملاء</h2>
        <button
          onClick={() => setShowNewCustomerModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus size={16} />
          عميل جديد
        </button>
      </div>

      <div className={`rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="text-right py-3 px-4">رقم العميل</th>
                <th className="text-right py-3 px-4">الاسم</th>
                <th className="text-right py-3 px-4">الهاتف</th>
                <th className="text-right py-3 px-4">عدد الطلبات</th>
                <th className="text-right py-3 px-4">النقاط</th>
                <th className="text-right py-3 px-4">آخر زيارة</th>
                <th className="text-right py-3 px-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <td className="py-3 px-4 font-mono">#{customer.id}</td>
                  <td className="py-3 px-4 font-semibold">{customer.name}</td>
                  <td className="py-3 px-4">{customer.phone}</td>
                  <td className="py-3 px-4">{customer.totalOrders}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                      {customer.points}
                    </span>
                  </td>
                  <td className="py-3 px-4">{customer.lastVisit}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700" title="عرض السجل">
                        <Eye size={16} />
                      </button>
                      <button className="text-orange-500 hover:text-orange-700" title="تعديل">
                        <Edit size={16} />
                      </button>
                      <button className="text-green-500 hover:text-green-700" title="طلب جديد">
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // إدارة الفروع
  const BranchesManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الفروع</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
          <Plus size={16} />
          فرع جديد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {branches.map(branch => (
          <div key={branch.id} className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">{branch.name}</h3>
                <p className="text-sm opacity-75">{branch.location}</p>
              </div>
              <Building2 className="w-8 h-8 opacity-50" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>إيرادات اليوم:</span>
                <span className="font-bold text-green-600">{branch.dailyRevenue} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span>طلبات اليوم:</span>
                <span className="font-bold">{branch.dailyOrders}</span>
              </div>
              <div className="flex justify-between">
                <span>المدير:</span>
                <span>{branch.manager}</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                عرض التفاصيل
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <Settings size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // التقارير
  const Reports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">التقارير والتحليلات</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-bold mb-4">أداء المبيعات - الأسبوع الماضي</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>السبت:</span>
              <span className="font-bold">1,250 ر.س</span>
            </div>
            <div className="flex justify-between">
              <span>الأحد:</span>
              <span className="font-bold">980 ر.س</span>
            </div>
            <div className="flex justify-between">
              <span>الاثنين:</span>
              <span className="font-bold">1,450 ر.س</span>
            </div>
            <div className="flex justify-between">
              <span>الثلاثاء:</span>
              <span className="font-bold">1,120 ر.س</span>
            </div>
            <div className="flex justify-between">
              <span>الأربعاء:</span>
              <span className="font-bold">1,380 ر.س</span>
            </div>
            <div className="flex justify-between">
              <span>الخميس:</span>
              <span className="font-bold">1,200 ر.س</span>
            </div>
            <div className="flex justify-between">
              <span>الجمعة:</span>
              <span className="font-bold">890 ر.س</span>
            </div>
          </div>
        </div>

        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-bold mb-4">الخدمات الأكثر طلباً</h3>
          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{service.name}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-20 h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}>
                    <div 
                      className="h-full bg-blue-500 rounded" 
                      style={{ width: `${Math.random() * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm">{Math.floor(Math.random() * 50) + 10}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // مودال الطلب الجديد
  const NewOrderModal = () => (
    showNewOrderModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">طلب جديد</h3>
            <button 
              onClick={() => setShowNewOrderModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* اختيار العميل */}
            <div>
              <label className="block text-sm font-medium mb-2">العميل</label>
              <select
                value={newOrder.customerId}
                onChange={(e) => setNewOrder({...newOrder, customerId: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="">اختر العميل</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
            </div>

            {/* الخدمات */}
            <div>
              <label className="block text-sm font-medium mb-2">الخدمات</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {services.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => addServiceToOrder(service)}
                    className="p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-center"
                  >
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-green-600">{service.price} ر.س</div>
                  </button>
                ))}
              </div>

              {/* الخدمات المختارة */}
              {newOrder.services.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">الخدمات المختارة:</p>
                  <div className="space-y-2">
                    {newOrder.services.map((service, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span>{service}</span>
                        <button 
                          onClick={() => removeServiceFromOrder(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* طريقة الدفع */}
            <div>
              <label className="block text-sm font-medium mb-2">طريقة الدفع</label>
              <select
                value={newOrder.paymentMethod}
                onChange={(e) => setNewOrder({...newOrder, paymentMethod: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="كاش">كاش</option>
                <option value="شبكة">شبكة</option>
                <option value="تحويل بنكي">تحويل بنكي</option>
                <option value="مدى">مدى</option>
                <option value="Apple Pay">Apple Pay</option>
              </select>
            </div>

            {/* ملاحظات */}
            <div>
              <label className="block text-sm font-medium mb-2">ملاحظات</label>
              <textarea
                value={newOrder.notes}
                onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                placeholder="ملاحظات إضافية..."
              />
            </div>

            {/* المجموع */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>المجموع:</span>
                <span>{newOrder.total} ر.س</span>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex gap-3">
              <button
                onClick={createNewOrder}
                disabled={!newOrder.customerId || newOrder.services.length === 0}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                إنشاء الطلب
              </button>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // مودال العميل الجديد
  const NewCustomerModal = () => (
    showNewCustomerModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`rounded-lg p-6 w-full max-w-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">عميل جديد</h3>
            <button 
              onClick={() => setShowNewCustomerModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
              <input
                type="text"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                placeholder="أدخل اسم العميل"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
              <input
                type="tel"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                placeholder="05xxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">العنوان (اختياري)</label>
              <textarea
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                placeholder="عنوان العميل"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={addNewCustomer}
                disabled={!newCustomer.name || !newCustomer.phone}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                إضافة العميل
              </button>
              <button
                onClick={() => setShowNewCustomerModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // قائمة التنقل الجانبية
  const navigation = [
    { id: 'dashboard', name: 'لوحة التحكم', icon: Home },
    { id: 'orders', name: 'إدارة الطلبات', icon: Receipt },
    { id: 'customers', name: 'إدارة العملاء', icon: Users },
    { id: 'branches', name: 'إدارة الفروع', icon: Building2 },
    { id: 'reports', name: 'التقارير', icon: BarChart3 },
    { id: 'notifications', name: 'التنبيهات', icon: Bell },
    { id: 'loyalty', name: 'نظام الولاء', icon: Gift },
    { id: 'settings', name: 'الإعدادات', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'orders': return <OrdersManagement />;
      case 'customers': return <CustomersManagement />;
      case 'branches': return <BranchesManagement />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`} dir="rtl">
      {/* الشريط العلوي */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">نظام إدارة المغاسل الذكي</h1>
            <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-blue-100 text-blue-800'}`}>
              {user.branch}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            <div className="flex items-center gap-2">
              <div className="text-sm">
                <div className="font-medium">{user.name}</div>
                <div className="text-gray-500">{user.role}</div>
              </div>
              <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} flex items-center justify-center`}>
                <User size={20} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* القائمة الجانبية */}
        <nav className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l min-h-screen`}>
          <div className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-right transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-500 text-white'
                          : darkMode
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* المحتوى الرئيسي */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>

      {/* المودالات */}
      <NewOrderModal />
      <NewCustomerModal />
    </div>
  );
};

export default LaundryManagementSystem;
