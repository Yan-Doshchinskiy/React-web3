import React, { useState } from "react";
import './BaseButton.scss';

type ButtonType = JSX.IntrinsicElements['button']['type']

interface IButtonProps {
  type?: ButtonType,
  children?: React.ReactNode,
  className?: string,
  onClick?: () => any,
  disabled?: boolean,
  mode?: string
}

const defaultProps: Partial<IButtonProps> = {
  type: "button",
  children: null,
  className: '',
  disabled: false,
  mode: 'purple',
};


export const BaseButton = ({ type, children, className, onClick, disabled, mode }: IButtonProps) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (onClick) {
      setLoading(true);
      await onClick();
      setLoading(false);
    }
  };
  return (
    <button
      disabled={disabled || loading}
      type={type}
      className={`base-button base-button_${mode} base-button_${disabled} ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

BaseButton.defaultProps = defaultProps;

export default BaseButton;
