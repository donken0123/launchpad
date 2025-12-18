/* 'use client';
import{ useState } from 'react'; 
import { Transaction } from "@iota/iota-sdk/transactions";

import { ConnectButton,
  useCurrentAccount,
  useCurrentWallet,
  useSignAndExecuteTransaction,
  useIotaClient,  
} from '@iota/dapp-kit';
import { styleText } from 'util';

export default function CreatetokenPage(){
  const account = useCurrentAccount();
  const iotaclient = useIotaClient();
  const {mutate: signAndExecute, isPending} = useSignAndExecuteTransaction();

  //表單
  const[formData, setFormData] = useState({
    iotaname:'',
    symbol:'',
    description:'',
    iconURL:'',
    decimals: 9,  
  });

  //狀態
  const[status, setSatus] = useState('');
  const[isCompiling, setIscompiling]= useState(false);
  const[result, setResult]= useState<{
    digest: string;
    packageId: string;
    treasuryCapId: string;
    coinType: string;
  } | null>(null);

  return(
    <main>
      <div>
        <h1>一鍵發幣</h1>
        <p>在sui上創建你自己的代幣</p>
      </div>
      <div>
        <ConnectButton/>
       </div> 
       {account?(
        <div>
        <div>
          <span>已連接:</span>
          <span>{account.address.slice(0,6)}...{account.address.slice(-4)}</span>
        </div>

        <div>
          <label>代幣名稱*</label>
          <input></input>
        </div>  
       )}


    </main>
  )
}


const txb= new Transaction();
txb.publish */
'use client';

import { useState } from 'react';
import { ConnectButton } from '@iota/dapp-kit';
import TokenForm from '@/components/TokenForm';
import Profile from '@/components/Profle';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'token' | 'featureB'>('token');

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="header-nav">
        <div className="flex items-center gap-2">
          <span className="text-2xl logo-float">🪙</span>
          <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Token launchpad
          </span>
        </div>

        <nav className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage('token')}
            className={`nav-link ${currentPage === 'token' ? 'active' : ''}`}
          >
            Create token
          </button>
          <button
            onClick={() => setCurrentPage('featureB')}
            className={`nav-link ${currentPage === 'featureB' ? 'active' : ''}`}
          >
            Profile
          </button>
          
        </nav>
        <ConnectButton />
      </header>

      {/* 內容 */}
      <div className="p-4 md:p-8">
        {currentPage === 'token' && (
          <>
            <div className="text-center mb-8">
              <h1 className="page-title">一鍵發幣</h1>
              <p className="page-subtitle">在 IOTA 上快速創建你的代幣</p>
            </div>
            <div className="max-w-xl mx-auto">
              <TokenForm />
            </div>
          </>
        )}

        {currentPage === 'featureB' && (
          <>
            <div className="text-center mb-8">
               <h1 className="page-title">我的代幣</h1>
              <p className="page-subtitle">查看一鍵發幣的所有代幣</p>
            </div>
            <div className="max-w-xl mx-auto">
                <Profile />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
