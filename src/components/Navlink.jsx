import React from 'react'
import styled from 'styled-components'

const NavList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
`

const NavItem = styled.li`
  margin-right: 20px;
  flex-shrink: 0;
`

const NavLink = styled.a`
  position: relative;
  text-decoration: none;
  padding-bottom: 5px;
  color: #333;
  font-weight: 600;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #007bff;
    border-radius: 2px;
    transition: left 0.3s ease, width 0.3s ease;
  }

  &.active::after {
    width: 100%;
    left: 0;
  }

  &.active {
    color: #007bff;
  }

  &:hover::after {
    width: 100%;
    left: 0;
    transition: width 0.3s ease-out;
  }
`

function Navlink({ onCategoryChange, activeCategory }) {
  const handleTabClick = (tabName) => {
    onCategoryChange(tabName)
  }

  return (
    <NavList>
      {[
        'Hot Coffee',
        'Cold Coffee',
        'Specialty',
        'Matcha',
        'Mojito',
        'Sweets'
      ].map((category) => (
        <NavItem key={category}>
          <NavLink
            href="#"
            className={activeCategory === category ? 'active' : ''}
            onClick={() => handleTabClick(category)}
          >
            {category}
          </NavLink>
        </NavItem>
      ))}
    </NavList>
  )
}

export default Navlink
