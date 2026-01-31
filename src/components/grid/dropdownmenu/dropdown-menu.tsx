import React from "react";


interface DropdownMenuProps {
    posX: number;
    posY: number;
    onClick: (item: any) => void;
    visible: boolean;
}

export function DropdownMenu({ posX, posY, onClick, visible }: DropdownMenuProps) {
    const antd = require('antd');

    return (
        <antd.Menu
            style={{
                position: "absolute",
                top: posY,
                left: posX,
                display: visible ? 'block' : 'none'
            }}
            onClick={(e) => {
                onClick(e);
            }}
            items={[
                {
                    key: "1",
                    label: "Insert row above"
                },
                {
                    key: "2",
                    label: "Insert row below"
                },
                {
                    key: "3",
                    label: "Delete row"
                },
                {
                    key: "4",
                    label: "Insert column left"
                },
                {
                    key: "5",
                    label: "Insert column right"
                },
                {
                    key: "6",
                    label: "Delete column"
                },
                {
                    key: "7",
                    label: "Add comment"
                },
                {
                    key: "8",
                    label: "Close"
                }
            ]}
        />
    );
}