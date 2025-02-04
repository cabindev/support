'use client'

import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: number;
}

export default function LoadingSpinner({ fullScreen = false, size = 24 }: LoadingSpinnerProps) {
  const spinner = (
    <Spin 
      indicator={
        <LoadingOutlined 
          style={{ 
            fontSize: size,
            color: 'var(--primary)'
          }} 
          spin
        />
      }
    />
  );

  if (fullScreen) {
    return (
      <Flex align="center" justify="center" style={{ height: '100vh' }}>
        {spinner}
      </Flex>
    );
  }

  return spinner;
}