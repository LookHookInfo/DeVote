import { AppLogo } from '@/components/Com';
import { ConnectButton, useActiveAccount } from 'thirdweb/react';
import { client } from '../lib/thirdweb/client';
import { chain } from '../lib/thirdweb/chain';
import { useNameContract } from '../hooks/useNameContract';
import { Link } from 'react-router-dom';

export function Header() {
  const { registeredName } = useNameContract(() => {});
  const account = useActiveAccount(); // Get the active account

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="max-1200 mx-auto">
      <header className="relative flex flex-wrap sm:justify-start sm:flex-nowrap w-full text-sm py-3">
        <nav className="max-w-[85rem] w-full mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <a
              className="flex items-center text-xl font-semibold dark:text-white focus:outline-hidden focus:opacity-80 mr-6"
              href="/"
              aria-label="Brand"
            >
              <AppLogo className="w-12 sm:w-16" />
              <span className="hidden sm:inline text-white text-2xl sm:text-3xl ml-2 sm:ml-3 font-bold">
                De&nbsp;<span className="text-[#a5c2ff]">Vote</span>
              </span>
            </a>
            <div className="flex items-center gap-x-4">
              <Link to="/archive" className="text-white hover:text-[#a5c2ff] transition-colors font-medium">Archive</Link>
            </div>
          </div>
          <div className="sm:order-3 flex items-center gap-x-2">
            <ConnectButton
              client={client}
              chain={chain}
              theme="dark"
              appMetadata={{
                name: 'De Vote',
                url: 'https://vote.lookhook.info/',
              }}
              detailsButton={{
                render: () => {
                  return (
                    <button className="flex items-center space-x-2 py-2 px-4 rounded-lg bg-[#a5c2ff] text-black font-bold hover:bg-[#8eafef] transition-all duration-200 shadow-lg shadow-blue-500/10">
                      {registeredName ? (
                        <span>{registeredName}</span>
                      ) : (
                        <span>{account?.address ? truncateAddress(account.address) : 'Connect'}</span>
                      )}
                    </button>
                  );
                },
              }}
            />
          </div>
        </nav>
      </header>
    </div>
  );
}
