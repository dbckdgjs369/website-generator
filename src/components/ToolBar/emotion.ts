import styled from "@emotion/styled";

export const ToolBarWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  flex-direction: column;
  border-radius: 8px;
  border: 1px solid #ddd;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
`;

export const CurrentWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export const Button = styled.button`
  flex: 1;
`;

export const CurrentStatusWrapper = styled.div`
  border-top: 1px solid black;
`;
