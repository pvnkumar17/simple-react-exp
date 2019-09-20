import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <nav>
      <NavLink to="/" exact>
        News Hacker
      </NavLink>
      {" | "}
      <NavLink to="/comments">
        Comments
      </NavLink>
    </nav>
  );
};

export default Header;
