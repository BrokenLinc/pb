import aiden from "../images/pb-aiden.webp";
import garnie from "../images/pb-garnie.webp";
import matt from "../images/pb-matt.webp";
import morrissey from "../images/pb-morrissey.webp";
import nyssa from "../images/pb-nyssa.webp";
import zachary from "../images/pb-zachary.webp";
import zachary2 from "../images/pb-zachary-2.webp";
import scott1 from "../images/pb-scott-1.webp";
import scott2 from "../images/pb-scott-2.webp";
import chris2 from "../images/pb-chris-2.webp";
import melisa from "../images/pb-melisa.webp";
import osman from "../images/pb-osman.webp";
import tyler from "../images/pb-tyler.webp";
import nikayla from "../images/pb-nikayla.webp";
import sanders from "../images/pb-sanders-2.webp";
import linc1 from "../images/linc-1.webp";
import linc2 from "../images/linc-2.webp";

export type StackImageData = {
  src: string;
  width: number;
  height: number;
  ratio: number;
  alt: string;
};

export const images: StackImageData[] = [
  {
    src: garnie,
    width: 1400,
    height: 989,
    ratio: 1400 / 989,
    alt: "Garnie",
  },
  {
    src: nikayla,
    width: 1400,
    height: 1400,
    ratio: 1400 / 1400,
    alt: "Nikayla",
  },
  {
    src: aiden,
    width: 750,
    height: 500,
    ratio: 750 / 500,
    alt: "Aiden",
  },
  {
    src: melisa,
    width: 1400,
    height: 1003,
    ratio: 1400 / 1003,
    alt: "Melisa",
  },
  {
    src: linc1,
    width: 488,
    height: 367,
    ratio: 488 / 367,
    alt: "Linc 1",
  },
  {
    src: linc2,
    width: 1400,
    height: 1400,
    ratio: 1400 / 1400,
    alt: "Linc 2",
  },
  {
    src: nyssa,
    width: 1323,
    height: 1249,
    ratio: 1323 / 1249,
    alt: "Nyssa",
  },
  {
    src: zachary,
    width: 1120,
    height: 1400,
    ratio: 1120 / 1400,
    alt: "Zachary",
  },
  {
    src: zachary2,
    width: 1051,
    height: 1400,
    ratio: 1051 / 1400,
    alt: "Zachary 2",
  },
  {
    src: matt,
    width: 457,
    height: 331,
    ratio: 457 / 331,
    alt: "Matt",
  },
  {
    src: chris2,
    width: 705,
    height: 1024,
    ratio: 705 / 1024,
    alt: "Chris 2",
  },
  {
    src: morrissey,
    width: 1400,
    height: 933,
    ratio: 1400 / 933,
    alt: "Morrissey",
  },
  {
    src: scott1,
    width: 1019,
    height: 767,
    ratio: 1019 / 767,
    alt: "Scott 1",
  },
  {
    src: scott2,
    width: 1216,
    height: 1294,
    ratio: 1216 / 1294,
    alt: "Scott 2",
  },
  {
    src: tyler,
    width: 1050,
    height: 1400,
    ratio: 1050 / 1400,
    alt: "Tyler",
  },
  {
    src: sanders,
    width: 1050,
    height: 1400,
    ratio: 1050 / 1400,
    alt: "Sanders 2",
  },
  {
    src: osman,
    width: 1050,
    height: 1400,
    ratio: 1050 / 1400,
    alt: "Osman",
  },
];
