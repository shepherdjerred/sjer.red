import type { APIContext } from "astro";
import React from "react";
import { BlogSchema } from "./content/schemas/blog";
import { EventSchema } from "./content/schemas/event";

export function renderMain(context: APIContext) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- this is safe with Zod
  const event = EventSchema.safeParse(context.props.entry?.data as unknown);
  if (event.success) {
    const props: {
      title: string;
      description?: string;
      isBlog: boolean;
    } = {
      title: event.data.title,
      isBlog: false,
    };

    if (event.data.description) {
      props.description = event.data.description;
    }

    return render(props);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- this is safe with Zod
  const blog = BlogSchema.safeParse(context.props.entry?.data);
  if (blog.success) {
    return render({
      title: blog.data.title,
      description: blog.data.description,
      isBlog: true,
    });
  }

  return render({
    // TODO: use page title here
    title: "Jerred Shepherd",
    description: "Hi there",
    isBlog: false,
  });
}

export function render({
  title,
  description,
  isBlog,
}: {
  title: string;
  description?: string;
  isBlog: boolean;
}): React.ReactNode {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#000",
        padding: "55px 70px",
        color: "#fff",
        fontFamily: "CommitMono",
        fontSize: 72,
      }}
    >
      <div
        style={{
          marginTop: 96,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 40,
        }}
      >
        {isBlog ? "by Jerred Shepherd" : description ? description : ""}
      </div>
    </div>
  );
}
