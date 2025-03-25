import { useState } from "react";

export function ReceiveNotification({user}){
   
    const [isOn, setIsOn] = useState(user?.receive_notifications || false); 
    const handleToggle = async () => {
        setIsOn(!isOn);
      
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/receiveNotification`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receive_notifications: !isOn }),
          });
      
          const data = await response.json();
      
          if (data.error) {
            console.error(data.error);
          } else {
            console.log(data.message);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
      
    return(
        <div className=" flex items-center justify-center gap-3">
    <p className="text-[13px] text-center"> Receive notifications via email?</p>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={isOn}
        onChange={handleToggle}
      />
      <div className="w-10 h-5 bg-gray-200 rounded-full peer transition-all duration-500 flex items-center">
        <div
          className={`w-5 h-5 rounded-full shadow-md transform transition-transform ${
            isOn ? "translate-x-5 bg-green-500" : "translate-x-0 bg-gray-500"
          }`}
        ></div>
      </div>
    </label>
    <span className="text-[13px] w-5 ">{isOn ? "Yes" : "No"}</span>
  </div>
    )
}