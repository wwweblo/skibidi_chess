import React from 'react'
import style from './Message.module.css'

interface AlertProps{
    text:string
}

export const Alert: React.FC<AlertProps> = ({text}) => {
  return (
    <div className={style.Alert} >{text}</div>
  )
}
