import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { getExternalLinkProps, isExternalHref } from "../ExternalLink";

export enum Person {
  ArchieForster = "archie-forster",
  AuroraConstantin = "aurora-constantin",
  CaterinaMammola = "caterina-mammola",
  CrisMaillo = "cris-maillo",
  CristinaAlexandru = "cristina-alexandru",
  DavidHiggins = "david-higgins",
  DornaHamedBarghi = "dorna-hamed-barghi",
  Fireship = "fireship",
  HusseinNasser = "hussein-nasser",
  KhalidBelhadj = "khalid-belhadj",
  LexFridman = "lex-fridman",
  PaulinaGerchuk = "paulina-gerchuk",
  PedroDuarte = "pedro-duarte",
  RaunoFreiberg = "rauno-freiberg",
  RobertaPosiunaite = "roberta-posiunaite",
  RussellCook = "russell-cook",
  StanFlint = "stan-flint",
  StephenMwangi = "stephen-mwangi",
  Theo = "theo",
  TobyBrown = "toby-brown",
  WietskeHolwerda = "wietske-holwerda",
}

type PersonDetails = {
  name: string;
  link: string;
  url?: string;
};

const people: Record<Person, PersonDetails> = {
  [Person.ArchieForster]: {
    name: "Archie Forster",
    link: "https://github.com/archieforster",
    url: "https://unavatar.io/github/archieforster",
  },
  [Person.AuroraConstantin]: {
    name: "Aurora Constantin",
    link: "https://sites.google.com/site/auroraconstantin/",
  },
  [Person.CaterinaMammola]: {
    name: "Caterina Mammola",
    link: "https://caterina.codes/",
    url: "https://unavatar.io/github/Cat2005",
  },
  [Person.CrisMaillo]: {
    name: "Cris Maillo",
    link: "https://crismaillo.net/",
    url: "https://unavatar.io/github/cris-maillo",
  },
  [Person.CristinaAlexandru]: {
    name: "Cristina Alexandru",
    link: "https://homepages.inf.ed.ac.uk/calexan4/",
  },
  [Person.DavidHiggins]: {
    name: "David Higgins",
    link: "https://github.com/david14higgins",
    url: "https://unavatar.io/github/david14higgins",
  },
  [Person.DornaHamedBarghi]: {
    name: "Dorna Hamed Barghi",
    link: "https://www.linkedin.com/in/dhamedbarghi/",
    url: "https://unavatar.io/github/dhamedbarghi",
  },
  [Person.Fireship]: {
    name: "Fireship",
    link: "https://www.youtube.com/@Fireship",
    url: "https://unavatar.io/youtube/Fireship",
  },
  [Person.HusseinNasser]: {
    name: "Hussein Nasser",
    link: "https://www.youtube.com/@hnasr",
    url: "https://unavatar.io/youtube/hnasr",
  },
  [Person.KhalidBelhadj]: {
    name: "Khalid Belhadj",
    link: "https://khalidbelhadj.github.io/portfolio/",
    url: "https://unavatar.io/github/khalidbelhadj",
  },
  [Person.LexFridman]: {
    name: "Lex Fridman",
    link: "https://lexfridman.com/podcast/",
    url: "https://unavatar.io/youtube/lexfridman",
  },
  [Person.PaulinaGerchuk]: {
    name: "Paulina Gerchuk",
    link: "https://paulinagerch.uk/",
    url: "https://unavatar.io/github/paulinasg",
  },
  [Person.PedroDuarte]: {
    name: "Pedro Duarte",
    link: "https://ped.ro/",
    url: "https://unavatar.io/twitter/peduarte",
  },
  [Person.RaunoFreiberg]: {
    name: "Rauno Freiberg",
    link: "https://rauno.me/",
    url: "https://unavatar.io/twitter/raunofreiberg",
  },
  [Person.RobertaPosiunaite]: {
    name: "Roberta Pošiūnaitė",
    link: "https://robertaposiunaite.com/",
    url: "https://unavatar.io/github/dprRoberta",
  },
  [Person.RussellCook]: {
    name: "Russell Cook",
    link: "https://www.linkedin.com/in/russell-cook1/",
    url: "https://unavatar.io/github/RussellCook4",
  },
  [Person.StanFlint]: {
    name: "Stan Flint",
    link: "https://stanflint.dev/",
    url: "https://unavatar.io/github/StanFlint",
  },
  [Person.StephenMwangi]: {
    name: "Stephen Mwangi",
    link: "https://stephenmwangi.com/",
    url: "https://unavatar.io/github/st3v3nmw",
  },
  [Person.Theo]: {
    name: "Theo",
    link: "https://www.youtube.com/@t3dotgg",
    url: "https://unavatar.io/youtube/t3dotgg",
  },
  [Person.TobyBrown]: {
    name: "Toby Brown",
    link: "https://www.tobyabrown.com/",
    url: "https://unavatar.io/x/tobyab_",
  },
  [Person.WietskeHolwerda]: {
    name: "Wietske Holwerda",
    link: "https://wiets.dev/",
    url: "https://unavatar.io/github/wietsdev",
  },
};

type AvatarProps = {
  person: Person;
  className?: string;
  hideSurname?: boolean;
  link?: string;
  name?: string;
  url?: string;
};

export const Avatar = ({
  person,
  className,
  hideSurname = false,
  link,
  name,
  url,
}: AvatarProps) => {
  const personDetails = people[person];
  const fullName = name ?? personDetails.name;
  const displayName = hideSurname ? fullName.split(" ")[0] : fullName;
  const avatarUrl = url ?? personDetails.url;
  const profileLink = link ?? personDetails.link;

  return (
    <Link
      href={profileLink}
      target={isExternalHref(profileLink) ? "_blank" : undefined}
      {...getExternalLinkProps(profileLink)}
      className={cn(
        "bg-card rounded-full py-0.5 pl-1 pr-1.5 inline-block",
        className,
      )}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={`${fullName}'s avatar`}
          width={100}
          height={100}
          draggable={false}
          className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full inline-block align-text-top select-none"
        />
      ) : (
        <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full inline-flex items-center justify-center align-text-top select-none bg-accent">
          <span className="text-sm text-white">?</span>
        </div>
      )}
      <span className="text-sm ml-1">{displayName}</span> ↗
    </Link>
  );
};

export default Avatar;
