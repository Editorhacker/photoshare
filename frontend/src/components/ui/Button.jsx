import React from "react";

const Button = ({ children, variant = "primary", className = "", style = {}, ...props }) => {
    const baseClass = variant === "secondary" ? "btn btn-secondary" : "btn";

    return (
        <button
            className={`${baseClass} ${className}`}
            style={style}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
