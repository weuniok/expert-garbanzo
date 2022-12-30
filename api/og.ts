import { type ImageResponseOptions, ImageResponse } from "@vercel/og";
import type * as React from "react";

const author = {
  name: "Yours Truly",
  avatarSrc: "https://i.pravatar.cc/256?u=30",
};

type Author = typeof author;

export const config = {
  runtime: "experimental-edge",
};

// Note: `vercel dev` doesn't run `.tsx` endpoints
//        and it can't run @vercel/og because of
//        > Invalid URL: ../vendor/noto-sans-v27-latin-regular.ttf

/**
 * TODO:
 * - [x] Use Inter font
 * - [ ] Update all libraries related to Vercel OG
 * - [ ] Grain Overlay
 * - [ ] Random Gradient or an illustration in the background
 * - [ ] Text with the color contrasting with gradient
 * - [ ] Very bold (weight 900) white title on top of the gradient
 * - [ ] White footer avatar of the author, their handle, date and reading time of the post
 * - [ ] Secure the endpoint https://vercel.com/docs/concepts/functions/edge-functions/og-image-examples#encrypting-parameters
 */

const font = fetch(new URL("../assets/TYPEWR__.TTF", import.meta.url)).then(
  (res) => res.arrayBuffer()
);

export default async function og(req: Request) {
  const url = new URL(req.url);

  const post = {
    date: new Date(url.searchParams.get("date") || 0),
    title: url.searchParams.get("title") || "Untitled",
    readingTimeMinutes: Number(url.searchParams.get("readingTime") || 0),
  };

  const fontData = await font;

  return new ImageResponse(
    h(
      "div",
      {
        tw: `
          w-full h-full
          font-[Typewriter] text-center
          bg-neutral-100 flex items-center content-center
        `,
      },
      h(Footer, { author, post })
    ),
    {
      width: 1200,
      height: 600,
      // fonts: await fonts(),
      fonts: [
        {
          name: "Typewriter",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}

function Footer({ author, post }: { author: Author; post: Post }) {
  return h(
    "footer",
    {
      tw: `
      bg-white
      flex flex-row gap-1
    `,
    },
    h("img", {
      width: 256,
      height: 256,
      src: author.avatarSrc,
      tw: `rounded-full`,
    }),
    h("span", {}, author.name),
    h("div", { tw: `flex-1` }),
    h(
      "span",
      {},
      [
        post.date.toLocaleDateString("sv-SE"),
        `${post.readingTimeMinutes} min read}`,
      ].join(" · ")
    )
  );
}

function h<T extends React.ElementType<any>>(
  type: T,
  props: React.ComponentPropsWithRef<T>,
  ...children: React.ReactNode[]
) {
  return {
    type,
    key: "key" in props ? props.key : null,
    props: {
      ...props,
      children: children && children.length ? children : props.children,
    },
  };
}

// async function fonts(): Promise<ImageResponseOptions["fonts"]> {
//   const [regular, black] = await Promise.all(
//     [
//       "../assets/og-image/Inter-Regular.ttf",
//       "../assets/og-image/Inter-Black.ttf",
//     ].map((url) =>
//       fetch(new URL(url, import.meta.url)).then((res) => res.arrayBuffer())
//     )
//   );

//   return [
//     {
//       name: "Inter",
//       data: regular,
//       weight: 400,
//       style: "normal",
//     },
//     {
//       name: "Inter",
//       data: black,
//       weight: 900,
//       style: "normal",
//     },
//   ];
// }

type Post = {
  date: Date;
  title: string;
  readingTimeMinutes: number;
};
