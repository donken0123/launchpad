'use client';

import { useCurrentAccount, useIotaClientQuery } from '@iota/dapp-kit';
import WalletButton from '@/components/walletbutton';
import { ConnectButton } from "@iota/dapp-kit";
export default function TestPage() {
  // 獲取當前帳戶
  const account = useCurrentAccount();
  
  // 如果已連接，查詢餘額
  const { data: balance, isLoading } = useIotaClientQuery(
    'getBalance',
    { owner: account?.address ?? '' },
    { enabled: !!account }
  );

  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* 標題 */}
        <h1 className="text-3xl font-bold text-center">
          🧪 錢包連接測試
        </h1>

        {/* 錢包按鈕 */}
        <div className="flex justify-center">
          <WalletButton />
        </div>

        {/* 連接狀態顯示 */}
        <div className="p-6 bg-slate-800 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold border-b border-slate-700 pb-2">
            📊 連接狀態
          </h2>
          
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-slate-400">狀態：</span>
              <span className={account ? 'text-green-400' : 'text-yellow-400'}>
                {account ? '✅ 已連接' : '⏳ 未連接'}
              </span>
            </p>
            
            {account && (
              <>
                <p>
                  <span className="text-slate-400">完整地址：</span>
                  <span className="text-cyan-400 break-all text-xs">
                    {account.address}
                  </span>
                </p>
                
                <p>
                  <span className="text-slate-400">SUI 餘額：</span>
                  <span className="text-green-400">
                    {isLoading 
                      ? '載入中...' 
                      : `${Number(balance?.totalBalance ?? 0) / 1e9} SUI`
                    }
                  </span>
                </p>
              </>
            )}
          </div>
        </div>

        {/* 測試說明 */}
        <div className="text-center text-slate-500 text-sm">
          <p>點擊「連接錢包」按鈕測試連接功能</p>
          <p>支援 Sui Wallet、Suiet 等錢包</p>
        </div>
        
      </div>
    </main>
  );
}