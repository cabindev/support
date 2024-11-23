// app/category/edit/[id]/page.tsx
'use client'
import { useEffect } from 'react'
import { Form, Input, Button, message } from 'antd'
import { useRouter } from 'next/navigation'

const { TextArea } = Input

export default function EditCategory({ params }: { params: { id: string } }) {
  const [form] = Form.useForm()
  const router = useRouter()

  useEffect(() => {
    fetchCategory()
  }, [])

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${params.id}`)
      const data = await response.json()
      form.setFieldsValue({
        name: data.name,
        description: data.description
      })
    } catch (error) {
      message.error('Failed to fetch category')
    }
  }

  const onFinish = async (values: any) => {
    try {
      const response = await fetch(`/api/categories/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      if (!response.ok) throw new Error('Failed to update category')

      message.success('Category updated successfully')
      router.push('/category')
    } catch (error) {
      message.error('Failed to update category')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: 'Please input category name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Category
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}