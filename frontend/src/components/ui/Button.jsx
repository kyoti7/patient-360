import "../css/Button.css";

const Button = ({
  children,
  variant = "primary",
  type = "button",
  onClick,
}) => {
  return (
    <button type={type} onClick={onClick} className={`btn btn-${variant}`}>
      {children}
    </button>
  );
};

export default Button;
