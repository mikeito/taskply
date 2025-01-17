import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../custom/button";

export const tableAddBtn = (url: string) => {
  return (
    <Link
      className={`${buttonVariants({ variant: "default", size: "sm" })} lg:flex mr-2 h-8`}
      href={url}
    >
      <CirclePlus className="mr-2 h-4 w-4" />
      Add
    </Link>
  );
};
