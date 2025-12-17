// app/components/PublishModule.tsx
'use client';

import { Transaction } from '@iota/iota-sdk/transactions';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@iota/dapp-kit';
import { useState } from 'react';
import {getPublishData} from '@/lib/tokentemaple';

// Bytecode 數據
const publishData = {
  modules: [
    "oRzrCwYAAAAKAQAMAgwkAzAtBF0MBWluB9cB0gEIqQNgBokEcwr8BAUMgQU7AAwCBwITAhQCFQEOAAICAAEADAEAAQEBDAEAAQEEDAEAAQMFAgAEBgcABQMHAQAAAAoAAQABCAgJAQIBCwoLAQACDwUBAQwCEA8BAQwDEQwNAAQNAwQABRIFBgEABwQBBwIHBA4DEAQRAggABwgEAAILAgEIAAsDAQgAAQoCAQgFAQkAAQsGAQkAAQgABwkAAgoCCgIKAgsGAQgFBwgEAgsDAQkACwIBCQADBwsDAQkAAwcIBAELAQEJAAEGCAQBBQELAQEIAAIJAAUBCwIBCAABCwMBCAAEQ29pbgxDb2luTWV0YWRhdGEGTVlDT0lOBk9wdGlvbgtUcmVhc3VyeUNhcAlUeENvbnRleHQDVXJsBGNvaW4PY3JlYXRlX2N1cnJlbmN5C2R1bW15X2ZpZWxkBGluaXQEbWludAZteWNvaW4VbmV3X3Vuc2FmZV9mcm9tX2J5dGVzBm9wdGlvbhRwdWJsaWNfZnJlZXplX29iamVjdA9wdWJsaWNfdHJhbnNmZXIGc2VuZGVyBHNvbWUIdHJhbnNmZXIKdHhfY29udGV4dAN1cmwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIDCACAxqR+jQMACgIDAmN0CgIIB0NhdGNvaW4KAgsKaSBsaWtlIGNhdAoCR0ZodHRwczovL2Nkbi5icml0YW5uaWNhLmNvbS8xNi8yMzQyMTYtMDUwLUM2NkY4NjY1L2JlYWdsZS1ob3VuZC1kb2cuanBnAAIBCQEAAAAAAhwLADEJBwEHAgcDBwQRBjgACgE4AQwCDAMNAwcACgE4AgoBLhEFOAMLAjgECwMLAS4RBTgFAgA="
  ],
  dependencies: [
    "0x0000000000000000000000000000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000000000000000000000000000002"
  ]
};

// Base64 轉 Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export default function PublishModule() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async() => {
    if (!account) {
      setError('請先連接錢包');
      return;
    }
    const publishData1 = await getPublishData();
    const tx = new Transaction();

    // 轉換 bytecode
    //const modules = publishData.modules.map(m => base64ToUint8Array(m));

    // 發布模組
    const [upgradeCap] = tx.publish({
      modules:publishData1.modules,
      dependencies: publishData1.dependencies,
    });

    // 將 UpgradeCap 轉移給自己
    tx.transferObjects([upgradeCap], account.address);

    // 簽名並執行
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (data) => {
          console.log('Success:', data);
          setResult(`交易成功！Digest: ${data.digest}`);
          setError(null);
        },
        onError: (err) => {
          console.error('Error:', err);
          setError(`發布失敗: ${err.message}`);
          setResult(null);
        },
      }
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">發布代幣模組</h2>
      
      {!account ? (
        <p className="text-red-500">請先連接錢包</p>
      ) : (
        <div>
          <p className="mb-2">錢包地址: {account.address}</p>
          
          <button
            onClick={handlePublish}
            disabled={isPending}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isPending ? '發布中...' : '發布代幣'}
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
          {result}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
    </div>
  );
}