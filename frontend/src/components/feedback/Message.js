const Message = ({ msg, type }) => {
  const baseClasses =
    "rounded-[5px] px-[10px] py-[5px] m-0 flex justify-center items-center border border-[#000]";

  const typeClasses = {
    error: "text-[#721c24] bg-[#f8d7da] border-[#f5c6cb]",
    success: "text-[#155724] bg-[#D4EDDA] border-[#c3e6cb]",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type] || ""}`}>
      <p>{msg}</p>
    </div>
  );
};

export default Message;