import styled from 'styled-components';

// Styles
const Container = styled.div`
  background: white;
  padding: 2rem;
  height: auto;
`;

const Button = styled.button`
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  margin-top: 1rem;
  padding-top: 0.6rem;
  padding-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  background: transparent;
  color: #22b8cf;
  border: 1px solid #22b8cf;
  border-radius: 4px;
  outline: none;
  transition: all 0.5s ease;
  &:hover .layer {
    top: 0;
  }
`;

const Label = styled.div`
  color: white;
  position: absolute;
  left: 0;
  top: -70px;
  width: 100%;
  padding: 10px 0;
  background: #22b8cf;
  transition: all 0.4s ease;
`;

export { Container, Button, Label };
