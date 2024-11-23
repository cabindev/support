//app/ebook/create/page.tsx
'use client'
import { useState, useEffect } from 'react';
import { Form, Input, Select, Upload, Button, message, Card, Col, Row } from 'antd';
import { UploadOutlined, FileOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { UploadFile } from 'antd/es/upload';
import imageCompression from 'browser-image-compression';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

interface Category {
  id: string;
  name: string;
}

interface FormValues {
  title: string;
  author: string;
  description: string;
  categoryId: string;
  coverImage?: UploadFile[];
  pdfFile?: UploadFile;
}

export default function CreateBook() {
  const [form] = Form.useForm<FormValues>();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coverImage, setCoverImage] = useState<UploadFile[]>([]);
  const [pdfFile, setPdfFile] = useState<UploadFile[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('ไม่สามารถโหลดประเภทหมวดหมู่ได้');
    }
  };

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleCoverImageChange = async (info: any) => {
    const { fileList } = info;
    // Create preview immediately
    const newPreviewImages = await Promise.all(
      fileList.map((file: UploadFile) => {
        if (file.originFileObj) {
          return getBase64(file.originFileObj);
        }
        return '';
      })
    );
    setPreviewImages(newPreviewImages.filter(Boolean));

    // Compress images
    const compressedFileList = await Promise.all(
      fileList.map(async (file: UploadFile) => {
        if (file.originFileObj) {
          const options = {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
            fileType: 'image/webp',
          };
          try {
            const compressedFile = await imageCompression(file.originFileObj, options);
            const webpFile = new File(
              [compressedFile], 
              `${file.name.split('.')[0]}.webp`, 
              { type: 'image/webp' }
            );
            return {
              ...file,
              originFileObj: webpFile,
              name: webpFile.name,
              type: 'image/webp',
            };
          } catch (error) {
            console.error('Error compressing image:', error);
            return file;
          }
        }
        return file;
      })
    );
    setCoverImage(compressedFileList);
  };

  const renderFormItem = (name: string, label: string, component: React.ReactNode, rules?: any[]) => (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
    >
      {component}
    </Form.Item>
  );
  const onFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      if (!session?.user?.email) {
        message.error('กรุณาเข้าสู่ระบบก่อน');
        return;
      }

      if (!coverImage.length || !pdfFile.length) {
        message.error('กรุณาอัพโหลดรูปปกและไฟล์ PDF');
        return;
      }

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Append files
      coverImage.forEach((file) => {
        if (file.originFileObj) {
          formData.append('coverImage', file.originFileObj);
        }
      });

      if (pdfFile[0]?.originFileObj) {
        formData.append('pdfFile', pdfFile[0].originFileObj);
      }

      await axios.post('/api/books', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      message.success('สร้างหนังสือสำเร็จ');
      router.push('/ebook');
    } catch (error) {
      console.error('Error:', error);
      message.error('ไม่สามารถสร้างหนังสือได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">สร้างหนังสือใหม่</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="ข้อมูลหนังสือ" className="mb-4">
              {renderFormItem("title", "ชื่อหนังสือ", 
                <Input placeholder="กรอกชื่อหนังสือ" />,
                [{ required: true, message: "กรุณากรอกชื่อหนังสือ" }]
              )}

              {renderFormItem("author", "ผู้เขียน", 
                <Input placeholder="กรอกชื่อผู้เขียน" />,
                [{ required: true, message: "กรุณากรอกชื่อผู้เขียน" }]
              )}

              {renderFormItem("categoryId", "หมวดหมู่", 
                <Select placeholder="เลือกหมวดหมู่">
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id}>{category.name}</Option>
                  ))}
                </Select>,
                [{ required: true, message: "กรุณาเลือกหมวดหมู่" }]
              )}

              {renderFormItem("description", "รายละเอียด", 
                <TextArea rows={4} placeholder="กรอกรายละเอียดหนังสือ" />,
                [{ required: true, message: "กรุณากรอกรายละเอียด" }]
              )}
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="อัพโหลดไฟล์" className="mb-4">
              <Form.Item label="รูปปก" required>
                <Upload
                  listType="picture-card"
                  fileList={coverImage}
                  onChange={handleCoverImageChange}
                  beforeUpload={() => false}
                  accept="image/*"
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>อัพโหลดรูปปก</div>
                  </div>
                </Upload>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative h-48">
                      <Image
                        src={preview}
                        alt={`preview-${index}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </Form.Item>

              <Form.Item label="ไฟล์ PDF" required>
                <Upload
                  fileList={pdfFile}
                  onChange={({ fileList }) => setPdfFile(fileList)}
                  beforeUpload={() => false}
                  accept=".pdf"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>อัพโหลด PDF</Button>
                </Upload>
                {pdfFile.length > 0 && (
                  <div className="mt-2 p-2 bg-gray-50 rounded flex items-center">
                    <FileOutlined className="mr-2" />
                    <span>{pdfFile[0].name}</span>
                  </div>
                )}
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Form.Item className="text-center">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
            className="min-w-[200px]"
          >
            สร้างหนังสือ
          </Button>
        </Form.Item>
      </Form>

      <style jsx global>{`
        .ant-upload-list-picture-card .ant-upload-list-item {
          float: left;
          width: 104px;
          height: 104px;
          margin: 0 8px 8px 0;
        }
        .ant-upload.ant-upload-select-picture-card {
          width: 104px;
          height: 104px;
          margin: 0;
        }
        .ant-form-item-label > label {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}