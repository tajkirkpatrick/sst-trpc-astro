import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export interface MobileNavProps {
  username: string | undefined;
}

export default function MobileNav({ username }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger>
        <Button
          className="flex items-center justify-center"
          size="icon"
          variant="outline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="1.5"
              d="M20 7H4m16 5H4m16 5H4"
            ></path>
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full grow flex-col text-start">
        <SheetHeader>
          <SheetTitle>
            <p className="text-left text-lg font-semibold">
              {username ? `Welcome, ${username}` : "Menu"}
            </p>
          </SheetTitle>
        </SheetHeader>
        {!username && (
          <div className="flex grow flex-col items-center justify-center">
            <ul className="flex flex-col place-content-start gap-y-4 text-left">
              <li className="w-full">
                <Button
                  variant="link"
                  className="flex items-start text-lg transition-colors hover:text-black"
                  asChild
                >
                  <a href="/">
                    <span className="mr-2 inline-flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M19 22H5a1 1 0 0 1-1-1v-9.586a1 1 0 0 1 .293-.707l7-7a1 1 0 0 1 1.415 0l7 7a.994.994 0 0 1 .292.707V21a1 1 0 0 1-1 1Zm-9-7h4v5h4v-8.172l-6-6l-6 6V20h4v-5Z"
                        />
                      </svg>
                    </span>
                    Home
                  </a>
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="flex items-start text-lg transition-colors hover:text-black"
                  asChild
                >
                  <a href="/auth/login">
                    <span className="mr-2 inline-flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 256 256"
                      >
                        <path
                          fill="currentColor"
                          d="m144.49 136.49l-40 40a12 12 0 0 1-17-17L107 140H24a12 12 0 0 1 0-24h83L87.51 96.49a12 12 0 0 1 17-17l40 40a12 12 0 0 1-.02 17ZM192 28h-56a12 12 0 0 0 0 24h52v152h-52a12 12 0 0 0 0 24h56a20 20 0 0 0 20-20V48a20 20 0 0 0-20-20Z"
                        />
                      </svg>
                    </span>
                    Login
                  </a>
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="flex items-start text-lg transition-colors hover:text-black"
                  asChild
                >
                  <a href="/auth/register">
                    <span className="mr-2 inline-flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 48 48"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          stroke-linejoin="round"
                          stroke-width="4"
                        >
                          <path stroke-linecap="round" d="M7 42h36" />
                          <path d="M11 26.72V34h7.317L39 13.308L31.695 6L11 26.72Z" />
                        </g>
                      </svg>
                    </span>
                    Register
                  </a>
                </Button>
              </li>
            </ul>
          </div>
        )}
        {username && (
          <div className="flex grow flex-col items-center justify-center">
            <ul className="flex flex-col place-content-start gap-y-4 text-left">
              <li>
                <Button
                  variant="link"
                  className="flex items-start text-lg transition-colors hover:text-black"
                  asChild
                >
                  <a href="/logout">
                    <span className="mr-2 inline-flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h6q.425 0 .713.288T12 4q0 .425-.288.713T11 5H5v14h6q.425 0 .713.288T12 20q0 .425-.288.713T11 21H5Zm12.175-8H10q-.425 0-.713-.288T9 12q0-.425.288-.713T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7q.275-.3.7-.313t.725.288L20.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.713.288t-.712-.313q-.275-.3-.263-.713t.288-.687l1.85-1.85Z"
                        />
                      </svg>
                    </span>
                    Logout
                  </a>
                </Button>
              </li>
            </ul>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
