import React, {ReactNode} from 'react'
import style from './Message.module.css'

interface AlertProps{
    children?: ReactNode,
    text?:string
}

export const Alert: React.FC<AlertProps> = ({text, children}) => {
  return (
    <div className={style.Alert} >
      {text} {children}
    </div>
  )
}
