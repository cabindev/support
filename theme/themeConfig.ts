// theme/themeConfig.ts
export const theme = {
    token: {
      // สีหลัก
      colorPrimary: '#f58220', // สีส้มหลัก
      colorSuccess: '#52c41a', // สีเขียว
      colorWarning: '#faad14', // สีเหลือง
      colorError: '#ff4d4f', // สีแดง
      colorInfo: '#f58220', // สีส้มสำหรับ info
      
      // สีพื้นหลังและข้อความ
      colorBgContainer: '#ffffff', // พื้นหลังขาว
      colorText: '#333333', // ข้อความสีเทาเข้ม
      colorTextSecondary: '#666666', // ข้อความสีเทา
      colorTextDescription: '#999999', // ข้อความสีเทาอ่อน
      
      // สีขอบและเส้น
      colorBorder: '#d9d9d9', // ขอบสีเทาอ่อน
      colorSplit: '#f0f0f0', // เส้นแบ่งสีเทาอ่อนมาก
      
      // การปัดมุม
      borderRadius: 6,
    },
    components: {
      Button: {
        colorPrimary: '#f58220',
        colorPrimaryHover: '#ff9900',
        colorPrimaryActive: '#e67816',
        colorPrimaryBg: '#fff7e6',
      },
      Switch: {
        colorPrimary: '#f58220',
        colorPrimaryHover: '#ff9900',
      },
      Table: {
        colorPrimary: '#f58220',
        colorBgContainer: '#ffffff',
        colorTextHeading: '#333333',
      },
      Menu: {
        colorPrimary: '#f58220',
        colorItemBgSelected: 'rgba(245, 130, 32, 0.1)',
        colorItemBgHover: 'rgba(245, 130, 32, 0.05)',
        colorItemText: '#333333',
        colorItemTextHover: '#f58220',
        colorItemTextSelected: '#f58220',
      },
      Card: {
        colorBgContainer: '#ffffff',
        colorBorderSecondary: '#f0f0f0',
      },
      Input: {
        colorPrimary: '#f58220',
        colorBorder: '#d9d9d9',
        colorBgContainer: '#ffffff',
      },
      Select: {
        colorPrimary: '#f58220',
        colorBorder: '#d9d9d9',
        colorBgContainer: '#ffffff',
      },
      DatePicker: {
        colorPrimary: '#f58220',
        colorBgContainer: '#ffffff',
      },
      Message: {
        colorBgElevated: '#ffffff',
        colorSuccess: '#52c41a',
        colorError: '#ff4d4f',
        colorWarning: '#faad14',
        colorInfo: '#f58220',
      },
      Notification: {
        colorBgElevated: '#ffffff',
        colorSuccess: '#52c41a',
        colorError: '#ff4d4f',
        colorWarning: '#faad14',
        colorInfo: '#f58220',
      }
    }
  }