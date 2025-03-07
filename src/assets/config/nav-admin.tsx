import { FaHome, FaUserAlt } from "react-icons/fa";
import { PiSoccerBallDuotone, PiUsersThreeFill } from "react-icons/pi";

const NavConfig = [
  {
    title: "Menu",
    key: "forall",
    items: [
      {
        key: "dashboard",
        title: "teste",
        href: "/dashboard",
        icon: FaHome,
        shouldMatchExactHref: true,
      },
      {
        key: "profile-admin",
        title: "teste",
        href: "/dashboard/profile",
        icon: FaUserAlt,
      },
      {
        key: "players-admin",
        title: "teste",
        href: "/dashboard/players",
        icon: PiUsersThreeFill,
      },
      {
        key: "matches-admin",
        title: "teste",
        href: "/dashboard/matches",
        icon: PiSoccerBallDuotone,
      },
    ],
  },
];

export default NavConfig;
