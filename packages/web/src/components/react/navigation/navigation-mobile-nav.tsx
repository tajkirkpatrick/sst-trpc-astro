import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface MobileNavProps {
  userDisplayName: string | undefined;
}

export default function MobileNav({ userDisplayName }: MobileNavProps) {
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
              {userDisplayName ? `Welcome, ${userDisplayName}` : "Menu"}
            </p>
          </SheetTitle>
        </SheetHeader>
        {!userDisplayName && (
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
        {userDisplayName && (
          <div className="flex grow flex-col items-center justify-center">
            <ul className="flex flex-col place-content-start gap-y-4 text-left">
              <li>
                <Button
                  variant="link"
                  className="flex items-start text-lg transition-colors hover:text-black"
                  asChild
                >
                  <a href="/settings">
                    <span className="mr-2 inline-flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 256 256"
                      >
                        <path
                          fill="currentColor"
                          d="M128 80a48 48 0 1 0 48 48a48.05 48.05 0 0 0-48-48Zm0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32Zm88-29.84q.06-2.16 0-4.32l14.92-18.64a8 8 0 0 0 1.48-7.06a107.21 107.21 0 0 0-10.88-26.25a8 8 0 0 0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186 40.54a8 8 0 0 0-3.94-6a107.71 107.71 0 0 0-26.25-10.87a8 8 0 0 0-7.06 1.49L130.16 40h-4.32L107.2 25.11a8 8 0 0 0-7.06-1.48a107.6 107.6 0 0 0-26.25 10.88a8 8 0 0 0-3.93 6l-2.64 23.76q-1.56 1.49-3 3L40.54 70a8 8 0 0 0-6 3.94a107.71 107.71 0 0 0-10.87 26.25a8 8 0 0 0 1.49 7.06L40 125.84v4.32L25.11 148.8a8 8 0 0 0-1.48 7.06a107.21 107.21 0 0 0 10.88 26.25a8 8 0 0 0 6 3.93l23.72 2.64q1.49 1.56 3 3L70 215.46a8 8 0 0 0 3.94 6a107.71 107.71 0 0 0 26.25 10.87a8 8 0 0 0 7.06-1.49L125.84 216q2.16.06 4.32 0l18.64 14.92a8 8 0 0 0 7.06 1.48a107.21 107.21 0 0 0 26.25-10.88a8 8 0 0 0 3.93-6l2.64-23.72q1.56-1.48 3-3l23.78-2.8a8 8 0 0 0 6-3.94a107.71 107.71 0 0 0 10.87-26.25a8 8 0 0 0-1.49-7.06Zm-16.1-6.5a73.93 73.93 0 0 1 0 8.68a8 8 0 0 0 1.74 5.48l14.19 17.73a91.57 91.57 0 0 1-6.23 15l-22.6 2.56a8 8 0 0 0-5.1 2.64a74.11 74.11 0 0 1-6.14 6.14a8 8 0 0 0-2.64 5.1l-2.51 22.58a91.32 91.32 0 0 1-15 6.23l-17.74-14.19a8 8 0 0 0-5-1.75h-.48a73.93 73.93 0 0 1-8.68 0a8 8 0 0 0-5.48 1.74l-17.78 14.2a91.57 91.57 0 0 1-15-6.23L82.89 187a8 8 0 0 0-2.64-5.1a74.11 74.11 0 0 1-6.14-6.14a8 8 0 0 0-5.1-2.64l-22.58-2.52a91.32 91.32 0 0 1-6.23-15l14.19-17.74a8 8 0 0 0 1.74-5.48a73.93 73.93 0 0 1 0-8.68a8 8 0 0 0-1.74-5.48L40.2 100.45a91.57 91.57 0 0 1 6.23-15L69 82.89a8 8 0 0 0 5.1-2.64a74.11 74.11 0 0 1 6.14-6.14A8 8 0 0 0 82.89 69l2.51-22.57a91.32 91.32 0 0 1 15-6.23l17.74 14.19a8 8 0 0 0 5.48 1.74a73.93 73.93 0 0 1 8.68 0a8 8 0 0 0 5.48-1.74l17.77-14.19a91.57 91.57 0 0 1 15 6.23L173.11 69a8 8 0 0 0 2.64 5.1a74.11 74.11 0 0 1 6.14 6.14a8 8 0 0 0 5.1 2.64l22.58 2.51a91.32 91.32 0 0 1 6.23 15l-14.19 17.74a8 8 0 0 0-1.74 5.53Z"
                        />
                      </svg>
                    </span>
                    Settings
                  </a>
                </Button>
              </li>
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
