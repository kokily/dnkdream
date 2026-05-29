import styled from "styled-components";

export const Container = styled.div`
  max-width: 400px;
  margin: 80px auto;
  padding: 24px;
`;

export const Title = styled.h1`
  margin-bottom: 24px;
  font-size: 1.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #333;
  }
`;

export const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background: #222;
  color: #fff;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.p`
  color: #c00;
  font-size: 14px;
  margin: 0;
`;