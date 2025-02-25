'use client'

import React, { useState } from 'react';
import style from './ProgressBar.module.css';
import Button from '../Button/Button';

interface ProgressBarProps {
    progressStep?: number;
}

const Progressbar: React.FC<ProgressBarProps> = ({
    progressStep = 10}) => {
    let [progress, setProgress] = useState(0);

    function progressUp() {
        setProgress(prevProgress => Math.min(prevProgress + progressStep, 100)); // Ограничиваем до 100
    }

    function progressDown() {
        setProgress(prevProgress => Math.max(prevProgress - progressStep, 0)); // Ограничиваем до 0
    }

    return (
        <>
            <div className={` ${style.ProgressBar}`}>
                {/* Slider */}
                <div className={`${style.Slider}`} style={{ width: `${progress}%` }}>
                </div>
            </div>

            {/* <div className='flex align-middle justify-center'>
                <Button onClick={progressUp} variant='agree'>UP</Button>
                <Button onClick={progressDown} variant='decline'>DOWN</Button>
            </div> */}
        </>
    );
}

export default Progressbar;