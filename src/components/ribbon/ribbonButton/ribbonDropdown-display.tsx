import React, { useState } from 'react';

export function RibbonDropdownDisplay({ menu, name }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const antd = require('antd');

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div>
            <antd.Dropdown
                menu={menu}
                open={menuOpen}
                onOpenChange={(isOpen) => setMenuOpen(isOpen)} // Replace onVisibleChange with onOpenChange
            >
                <antd.Button onClick={toggleMenu}>{name}</antd.Button>
            </antd.Dropdown>
        </div>
    );
}
