import React from 'react';
import './ribbonButton-display.css';

interface RibbonButtonProps {
    name: string;
    onClick: () => void;
}

export function ribbonButtonDisplay({ name, onClick }: RibbonButtonProps) {
    const antd = require('antd');
    return <div>
        <antd.Button onClick={onClick}>{name}</antd.Button>
    </div>
}