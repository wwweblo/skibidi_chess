"use client"
import React, { ReactNode } from 'react'
import styles from './Button.module.css'

interface ButtonProps {
  children: ReactNode,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  style: string,
  size: string
}

const Button: React.FC<ButtonProps> = ({ children, onClick, style, size }) => {
  
  let buttonStyle;
  switch (style) {
    case 'green':
      buttonStyle = styles.green;
      break;
    case 'red':
      buttonStyle = styles.red;
      break;
    case 'gray':
      buttonStyle = styles.gray;
      break;
    default:
      buttonStyle = '';
  }

  let buttonSize
  switch (size) {
    case 'small':
      buttonSize = styles.small;
      break;
    case 'middle':
      buttonSize = styles.middle;
      break;
    case 'big':
      buttonSize = styles.big;
      break;
  }

  return (
    <button className={`${buttonStyle} ${buttonSize}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
