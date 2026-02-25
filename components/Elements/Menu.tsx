import React from 'react';

interface Props {
  menuItems: string[];
  selected: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
}

const Menu: React.FC<Props> = ({ menuItems, selected, setSelected }) => {
  return (
    <div className="menus-wrapper">
      {menuItems.map((item, index) => {
        const isActive = selected === index;
        return (
          <div
            key={index}
            onClick={() => {
              setSelected(index);
            }}
            className={`menu-item ${isActive ? 'menu-item-active' : ''}`}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};

export default Menu;
