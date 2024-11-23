// app/category/create/page.tsx
'use client'
import { Form, Input, Button, message } from 'antd'
import { useRouter } from 'next/navigation'

const { TextArea } = Input

export default function CreateCategory() {
  const [form] = Form.useForm()
  const router = useRouter()

  const onFinish = async (values: any) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      if (!response.ok) throw new Error('Failed to create category')

      message.success('Category created successfully')
      router.push('/category')
    } catch (error) {
      message.error('Failed to create category')
    }
  }

  return (
    <div className="container mx-auto p-4 pt-20">
      <h1 className="text-2xl font-bold mb-4">Create Category</h1>
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
            Create Category
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}