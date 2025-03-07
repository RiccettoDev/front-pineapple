import { FaHome, FaUserAlt } from "react-icons/fa";
import { FaLayerGroup } from "react-icons/fa6";
import { GiStarsStack } from "react-icons/gi";
import { PiSoccerBallDuotone, PiTShirtFill, PiUsersThreeFill } from "react-icons/pi";

const NavConfig = [
  {
    title: "Menu",
    key: "forall",
    items: [
      {
        key: "home",
        title: "Página inicial",
        href: "/home",
        icon: FaHome,
        shouldMatchExactHref: true,
      },
      {
        key: "profile",
        title: "Perfil",
        href: "/home/profile",
        icon: FaUserAlt,
      },
      {
        key: "players",
        title: "Jogadores",
        href: "/home/players",
        icon: PiUsersThreeFill,
      },
      {
        key: "matches",
        title: "Partida",
        href: "/home/matches",
        icon: PiSoccerBallDuotone,
      },
      {
        key: "teams",
        title: "Times",
        href: "/home/teams",
        icon: PiTShirtFill,
      },
      {
        key: "evaluations",
        title: "Avaliações",
        href: "/home/evaluations",
        icon: GiStarsStack,
      },
      {
        key: "groups",
        title: "Grupos",
        href: "/home/groups",
        icon: FaLayerGroup,
      },
    ],
  },
];

export default NavConfig;
