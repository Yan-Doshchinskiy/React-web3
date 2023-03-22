import React from "react";
import './BaseBadge.scss';


interface IBadgeProps  {
    children?: React.ReactNode,
    className?: string
}

const defaultProps:IBadgeProps = {
    children: null,
    className: ''
};


export const BaseBadge = ({ children, className }: IBadgeProps) => {
    return (
        <div className={`base-badge ${className}`}>
            {children}
        </div>
    );
};

BaseBadge.defaultProps = defaultProps;

export default BaseBadge;
