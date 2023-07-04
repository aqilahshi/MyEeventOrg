import React, { useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import avatar from '../../data/avatar.jpg';
import { Cart, Chat, Notification, UserProfile } from '..';
import { useStateContext } from '../../contexts/ContextProvider';
import './navbar.css'

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
    <TooltipComponent content={title} position="BottomCenter">
      <button
        type="button"
        onClick={() => customFunc()}
        style={{ color }}
        className="NavButton"
      >
        <span
          style={{ background: dotColor }}
          className="dot"
        />
        {icon}
      </button>
    </TooltipComponent>
  );
  

const Navbar = () => {
    const { currentColor, activeMenu, setActiveMenu, handleClick, isClicked, setScreenSize, screenSize } = useStateContext();

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
    
        window.addEventListener('resize', handleResize);
    
        handleResize();
    
        return () => window.removeEventListener('resize', handleResize);
      }, []);

      useEffect(() => {
        if (screenSize <= 900) {
          setActiveMenu(false);
        } else {
          setActiveMenu(true);
        }
      }, [screenSize]);


    return (
        <div className="Nav">
             <NavButton title="Menu" 
                customFunc={()=> setActiveMenu(
                (prevActiveMenu) =>
                !prevActiveMenu)}
                color={currentColor}
                icon={<AiOutlineMenu />} 
            />
            <div className='Nav-container'>
                <NavButton title="Cart" customFunc={() => handleClick('cart')} color={currentColor} icon={<FiShoppingCart />} />
                <NavButton title="Chat" dotColor="#03C9D7" customFunc={() => handleClick('chat')} color={currentColor} icon={<BsChatLeft />} />
                <NavButton title="Notification" dotColor="rgb(254, 201, 15)" customFunc={() => handleClick('notification')} color={currentColor} icon={<RiNotification3Line />} />
                <TooltipComponent content="Profile" position="BottomCenter">
                <div
                    className="userprofile"
                    onClick={() => handleClick('userProfile')}
                    >
                    <img
                    className="userprofileimg"
                    src={avatar}
                    alt="user-profile"
                    />
                    <p>
                    <span className="profile-text">Hi,</span>{' '}
                    <span className="profile-text-bold">
                        Michael
                    </span>
                    </p>
                    <MdKeyboardArrowDown className="profile-icon" />
                </div>
                </TooltipComponent>
                {isClicked.cart && (<Cart />)}
                {isClicked.chat && (<Chat />)}
                {isClicked.notification && (<Notification />)}
                {isClicked.userProfile && (<UserProfile />)}    
            </div>
        </div>
    );
};

export default Navbar;