import { AppLogo } from '@/components/Com';

export function Footer() {
  return (
    <footer className="mt-auto w-full max-w-[85rem] py-4 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="text-center">
        {/* App Logo */}
        <div className="flex place-content-center">
          <a href="#">
            <AppLogo className="w-12" />
          </a>
        </div>

        {/* Footer Text */}
        <div className="mt-3">
          <p className="text-gray-400 dark:text-neutral-500">© 2025 All rights reserved.</p>
        </div>

        {/* Social Links */}
        <div className="mt-3 space-x-1">
          {/* X / Twitter */}
          <a
            className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-gray-200 text-white hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            href="https://x.com/LookHookInfo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="shrink-0 size-4"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <title>X</title>
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932Z" />
            </svg>
          </a>

          {/* Telegram */}
          <a
            className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-gray-200 text-white hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            href="https://t.me/ChainInside/491"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="shrink-0 size-4"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <title>Telegram</title>
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-gray-200 text-white hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            href="https://www.linkedin.com/company/lookhook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>

          {/* GitHub */}
          <a
            className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-gray-200 text-white hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            href="https://github.com/lookhookinfo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <title>GitHub</title>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.4.6.111.8-.26.8-.577v-2.097c-3.338.726-4.038-1.607-4.038-1.607-.545-1.375-1.33-1.74-1.33-1.74-1.089-.745.084-.73.084-.73 1.205.086 1.834 1.236 1.834 1.236 1.069 1.829 2.803 1.301 3.493.996.106-.775.419-1.301.762-1.597-2.664-.303-5.466-1.332-5.466-5.935 0-1.314.468-2.392 1.236-3.23-.124-.303-.536-1.526.116-3.168 0 0 1.008-.323 3.302 1.236a11.586 11.586 0 0 1 3.007-.404c1.02 0 2.046.133 3.007.404 2.294-1.559 3.302-1.236 3.302-1.236.653 1.642.24 2.865.116 3.168.768.838 1.236 1.916 1.236 3.23 0 4.615-2.806 5.633-5.485 5.935.423.362.8 1.073.8 2.18v3.041c0 .318.2.689.8.577C20.563 21.8 24 17.303 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>

          {/* Discord Icon */}
          <a
            href="https://discord.com/invite/D55sWhNgcb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center size-8 rounded-lg border border-gray-200 text-white hover:bg-gray-100 dark:text-neutral-400 dark:border-neutral-700 dark:hover:bg-neutral-700"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <title>Discord</title>
              <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2916a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.0994.246.1984.3728.292a.077.077 0 0 1-.0065.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.4189 0 1.3333-.9555 2.419-2.1569 2.419zm7.9748 0c-1.1825 0-2.1568-1.0857-2.1568-2.419 0-1.3332.9554-2.4189 2.1568-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.4189 0 1.3333-.946 2.419-2.1568 2.419Z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
