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
import WalletButton from '@/components/walletbutton';
//import TokenForm from '@/components/TokenForm';
import TokenForm from '@/components/TokenForm';

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4">
      {/* ========== 頂部導航 ========== */}
      <nav className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center logo-float">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Iota Token Launcher
          </span>
        </div>

        {/* 錢包按鈕 */}
        <WalletButton />
      </nav>

      {/* ========== 主內容區 ========== */}
      <div className="max-w-2xl mx-auto">
        {/* 標題 */}
        <div className="text-center mb-10">
          <h1 className="page-title">
            在 Iota 上一鍵發幣
          </h1>
          <p className="page-subtitle text-lg mt-4">
            無需編寫程式碼，快速創建並部署您的代幣
          </p>
        </div>

        {/* 表單卡片 */}
        <div className="card p-8">
          <TokenForm />
        </div>

        {/* 底部說明 */}
        <div className="mt-8 text-center text-sm text-slate-500 space-y-2">
          <p>
            部署的代幣將遵循 Iota 標準 Coin 規範
          </p>
          <p>
            請確保錢包中有足夠的 Iota 支付 Gas 費用
          </p>
        </div>
      </div>

      {/* ========== 裝飾元素 ========== */}
      <div className="fixed top-1/4 left-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
    </main>
  );
}
