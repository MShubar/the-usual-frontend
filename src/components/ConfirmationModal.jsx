import React from 'react'
import { Modal as AntModal } from 'antd'
import styled from 'styled-components'

function ConfirmationModal({
  open,
  onCancel,
  onConfirm,
  title = "Confirm Action",
  message,
  cancelText = "Cancel",
  confirmText = "Confirm",
  centered = true
}) {
  return (
    <StyledModal
      title={title}
      open={open}
      onCancel={onCancel}
      footer={[
        <CancelButton key="cancel" onClick={onCancel}>
          {cancelText}
        </CancelButton>,
        <ConfirmButton key="confirm" onClick={onConfirm}>
          {confirmText}
        </ConfirmButton>
      ]}
      centered={centered}
    >
      <ModalContent>
        <p>{message}</p>
      </ModalContent>
    </StyledModal>
  )
}

export default ConfirmationModal

const StyledModal = styled(AntModal)`
  .ant-modal-content {
    background-color: #181818;
    color: white;
    border-radius: 18px;
    box-shadow: 0 8px 32px #0008;
    padding: 32px 24px 24px 24px;
    border: none;
  }
  .ant-modal-header {
    background-color: #181818;
    color: white;
    border-bottom: 2px solid #222;
    border-radius: 18px 18px 0 0;
    padding: 24px 24px 12px 24px;
  }
  .ant-modal-title {
    color: #fff;
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 0.5px;
  }
  .ant-modal-close, .ant-modal-close-x {
    color: white !important;
    font-size: 22px;
    top: 18px;
    right: 18px;
  }
  .ant-modal-footer {
    background-color: #181818;
    border-top: 2px solid #222;
    border-radius: 0 0 18px 18px;
    padding: 18px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
`

const ModalContent = styled.div`
  color: #ccc;
  font-size: 16px;
  line-height: 1.6;
  
  p {
    margin: 8px 0;
  }
`

const CancelButton = styled.button`
  background: #222;
  color: #fff;
  border: 1px solid #555;
  border-radius: 8px;
  font-size: 16px;
  padding: 10px 24px;
  margin-right: 12px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  
  &:hover {
    background: #444;
    color: #ff9800;
    border-color: #ff9800;
  }
`

const ConfirmButton = styled.button`
  background: linear-gradient(90deg, #ff9800 60%, #ffb74d 100%);
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  padding: 10px 28px;
  cursor: pointer;
  box-shadow: 0 2px 8px #0002;
  transition: background 0.2s;
  
  &:hover {
    background: linear-gradient(90deg, #ffa726 60%, #ffd54f 100%);
    color: #222;
  }
`
