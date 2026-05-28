import React from "react";
import styled from "styled-components";

// Styled
const Container = styled.div``;

const Sidebar = styled.aside``;

const MobileHeader = styled.nav``;

const Content = styled.main``;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <Sidebar>
        <h3>D&K Dreams Blog</h3>
        {/* 카테고리 목록 컴포넌트 위치 */}
      </Sidebar>

      <MobileHeader>
        {/* 카테고리 목록 컴포넌트 위치 (모바일 버전) */}
      </MobileHeader>

      <Content>{children}</Content>
    </Container>
  );
}
