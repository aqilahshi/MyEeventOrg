import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';

const Vidcall = () => {
    const { currentColor} = useStateContext();
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();

  const submitCode = (e) => {
    e.preventDefault();
    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="m-2 md:m-15 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <form onSubmit={submitCode} 
        className="  text-slate-1000 md:pt-12 flex flex-col items-center justify-center">
        <div className=" flex flex-col justify-center items-center">
              <label className="text-[30px] md:text-[40px] font-bold pt-6">
                Enter Room Code
              </label>
              <input
                type="text"
                required
                placeholder="Enter Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="py-1.5 md:py-2 px-4 rounded-full max-w-[14rem] mt-5 text-black md:mt-8 outline-0"
              />
            </div>
                <button
                type="submit"
                style={{ background: currentColor }}
                className="text-base text-white p-2 mt-5 hover:drop-shadow-xl hover:bg-light-gray rounded-full opacity-0.9"
                >
                    Join Meeting
                </button>
        </form>
    </div>
  );
};

export default Vidcall;