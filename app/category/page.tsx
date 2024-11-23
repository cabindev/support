// app/category/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { Table, Button, message, Popconfirm } from 'antd'
import Link from 'next/link'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

export default function CategoryList() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      message.error('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete category')
      
      message.success('Category deleted successfully')
      fetchCategories()
    } catch (error) {
      message.error('Failed to delete category')
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Books Count',
      key: 'booksCount',
      render: (record: any) => record.books?.length || 0
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <div className="flex gap-2">
          <Link href={`/category/edit/${record.id}`}>
            <Button icon={<EditOutlined />} type="link">
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ]

  return (
    <div className="container mx-auto p-4 pt-20">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href="/category/create">
          <Button type="primary">Add Category</Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
      />
    </div>
  )
}