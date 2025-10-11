import styled from 'styled-components'
import { MdShoppingCart } from 'react-icons/md'

// Styled button component with dynamic width
const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: ${(props) => props.radius || '0'};
  gap: 10px;
  text-transform: capitalize;
  border: none;
  cursor: pointer;
  white-space: nowrap;

  width: ${(props) => props.width || '100%'};

  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  /* Button color styles */
  &.cancel {
    background-color: #e53935;
    color: white;
    &:hover {
      background-color: #c62828;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(227, 30, 36, 0.6);
    }
  }

  

  &.addtocart {
    background-color: black;
    color: white;
    &:hover {
      background-color: #388e3c;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(67, 160, 71, 0.6);
    }
  }


  &.checkout {
    background-color: #43a047;
    color: white;
    &:hover {
      background-color: #388e3c;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(67, 160, 71, 0.6);
    }
  }

  
  }

  /* Media queries for smaller screens */
  @media (max-width: 600px) {
    padding: 10px 16px;
    font-size: 0.9rem;
    width: 100%; /* Full width on mobile */
  }
`

const IconWrapper = styled.div`
  font-size: 1.3rem;
`

const Buttons = ({ type, onClick, children, width, radius }) => {
  const renderIcon = () => {
    switch (type) {
      case 'addtocart':
        return
      case 'checkout':
        return <MdShoppingCart />
      case 'cancel':
        return
      default:
        return null
    }
  }

  return (
    <StyledButton
      className={type}
      onClick={onClick}
      width={width}
      radius={radius}
    >
      <IconWrapper>{renderIcon()}</IconWrapper>
      {children}
    </StyledButton>
  )
}

export default Buttons
