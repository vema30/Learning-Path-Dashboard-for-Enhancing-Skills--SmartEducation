// Example: Navigation link in another component
import { Link } from "react-router-dom";
import MyCourses from "./MyCourses";
import MyProfile from "./MyProfile";

const NavigationMenu = () => {
  return (
    <nav>
      <Link to="/my-profile" ></Link>
    </nav>
  );
};

export default NavigationMenu;