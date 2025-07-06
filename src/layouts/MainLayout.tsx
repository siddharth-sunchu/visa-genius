import React from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Footer from './Footer';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ 
        background: '#fafafa',
        minHeight: 'calc(100vh - 64px - 300px)' // Account for header and footer
      }}>
        {children}
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainLayout; 