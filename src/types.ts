import { type InferOutput, object, pipe, string, transform } from "valibot";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export const coordsSchema = object({
  tileX: pipe(string(), transform(Number)),
  tileY: pipe(string(), transform(Number)),
  pixelX: pipe(string(), transform(Number)),
  pixelY: pipe(string(), transform(Number)),
});

export type Coords = InferOutput<typeof coordsSchema>;

export type File = {
  image: Buffer;
  name: string;
  width: number;
  height: number;
};

export type Drawing = Prettify<
  {
    id: string;
  } & Coords &
    File
>;

export class DrawingDTO implements Drawing {
  id: string;
  name: string;
  image: Buffer;
  width: number;
  height: number;
  tileY: number;
  tileX: number;
  pixelX: number;
  pixelY: number;
}

export type Stats = {
  totalPixels: number;
  paintedPixels: number;
  correctPixels: number;
  percentageComplete: number;
  colorsStats?: Record<
    string,
    {
      total: number;
      correct: number;
      incorrect: number;
      percentageComplete: number;
    }
  >;
};

export type Color = {
  color: { r: number; g: number; b: number; a: number };
  type: "free" | "paid";
  name: string;
};
