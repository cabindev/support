// app/ebook/edit/[id]/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { Form, Input, Select, Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import imageCompression from 'browser-image-compression'
import type { UploadFile } from 'antd/es/upload/interface'

const { TextArea } = Input

export default function EditBook({ params }: { params: { id: string } }) {
  const [form] = Form.useForm()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [book, setBook] = useState(null)
  const [coverImage, setCoverImage] = useState<UploadFile[]>([])
  const [pdfFile, setPdfFile] = useState<UploadFile[]>([])

  useEffect(() => {
    fetchBook()
    fetchCategories()
  }, [])

  const fetchBook = async () => {
    const response = await fetch(`/api/books/${params.id}`)
    const data = await response.json()
    setBook(data)
    form.setFieldsValue({
      title: data.title,
      author: data.author,
      description: data.description,
      categoryId: data.categoryId
    })
  }

  const fetchCategories = async () => {
    const response = await fetch('/api/categories')
    const data = await response.json()
    setCategories(data)
  }

  const handleCoverImageChange = async (info: any) => {
    const { file } = info
    if (file.originFileObj) {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: 'image/webp'
      }
      try {
        const compressedFile = await imageCompression(file.originFileObj, options)
        const webpFile = new File([compressedFile], 
          `${file.name.split('.')[0]}.webp`, 
          { type: 'image/webp' }
        )
        setCoverImage([{
          ...file,
          originFileObj: webpFile,
          name: webpFile.name,
          type: 'image/webp'
        }])
      } catch (error) {
        console.error('Error compressing image:', error)
        message.error('Error compressing image')
      }
    }
  }

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value.toString())
      })

      if (coverImage[0]?.originFileObj) {
        formData.append('coverImage', coverImage[0].originFileObj)
      }
      if (pdfFile[0]?.originFileObj) {
        formData.append('pdfFile', pdfFile[0].originFileObj)
      }

      const response = await fetch(`/api/books/${params.id}`, {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to update book')

      message.success('Book updated successfully')
      router.push('/ebook')
    } catch (error) {
      console.error('Error:', error)
      message.error('Failed to update book')
    } finally {
      setLoading(false)
    }
  }

  if (!book) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Book</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="author" label="Author" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
          <Select>
            {categories.map(cat => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Current Cover">
          <Image
            src={book.coverImage}
            alt="Current cover"
            width={200}
            height={300}
          />
        </Form.Item>

        <Form.Item label="New Cover Image">
          <Upload
            accept="image/*"
            fileList={coverImage}
            onChange={handleCoverImageChange}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Upload New Cover</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="New PDF File">
          <Upload
            accept=".pdf"
            fileList={pdfFile}
            onChange={({ fileList }) => setPdfFile(fileList)}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Upload New PDF</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Book
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}