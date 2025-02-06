"use client"
import React, { ButtonHTMLAttributes, Children, ReactNode } from 'react'
import styles from './Button.module.css'

interface ButtonProps {
    children: ReactNode,
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const Button: React.FC<ButtonProps> = ({children, onClick}) => {
  return (
    <button className={styles.backgroundWhite}
    onClick={onClick}>
        {children}
    </button>
  )
}

export default Button