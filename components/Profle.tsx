'use client';

import { useEffect, useState } from 'react';
import { useCurrentAccount, useIotaClient } from '@iota/dapp-kit';

interface TokenInfo {
  coinType: string;
  name: string;
  objectId: string;
  version: number;
}

export default function Profile() {
  const account = useCurrentAccount();
  const client = useIotaClient();
  
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 從類型字串中提取代幣名稱
  // 例如: "0x2::coin::TreasuryCap<0xabc123::iotapumpdog::IOTAPUMPDOG>" => "DOG"
  const extractTokenName = (type: string): string | null => {
    const match = type.match(/TreasuryCap<.*::(\w+)>$/);
    if (!match) return null;
    
    const fullName = match[1];
    
    // 判斷是否以 IOTAPUMP 開頭
    if (fullName.startsWith('IOTAPUMP')) {
      // 返回 IOTAPUMP 之後的部分
      return fullName.slice(8);
    }
    
    // 不是 IOTAPUMP 開頭，返回 null
    return null;
  };

  // 從類型字串中提取完整的 coin type
  const extractCoinType = (type: string): string => {
    const match = type.match(/TreasuryCap<(.+)>$/);
    return match ? match[1] : '';
  };

  useEffect(() => {
    const fetchTokens = async () => {
      if (!account?.address) {
        setTokens([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const objects = await client.getOwnedObjects({
          owner: account.address,
          options: {
            showType: true,
            showContent: true,
          },
        });

        const treasuryCaps = objects.data
          .filter((obj) => {
            const type = obj.data?.type;
            return type && type.includes('::coin::TreasuryCap<');
          })
          .map((obj) => {
            const type = obj.data?.type || '';
            const name = extractTokenName(type);
            return {
              coinType: extractCoinType(type),
              name: name || '',
              objectId: obj.data?.objectId || '',
              version: Number(obj.data?.version || 0),
            };
          })
          // 過濾掉不是 IOTAPUMP 開頭的
          .filter((token) => token.name !== '')
          // 排序：舊的在前，新的在後
          .sort((a, b) => a.version - b.version);

        setTokens(treasuryCaps);
      } catch (err) {
        console.error('查詢失敗:', err);
        setError('無法載入代幣列表');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [account?.address, client]);

  // 未連接錢包
  if (!account) {
    return (
      <div className="card p-6 text-center">
        <p style={{ color: 'var(--text-secondary)' }}>請先連接錢包</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="section-title mb-6">
        <span className="step-number">💰</span>
        我發布的代幣
      </h3>

      {/* 載入中 */}
      {loading && (
        <p style={{ color: 'var(--text-secondary)' }}>載入中...</p>
      )}

      {/* 錯誤 */}
      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {/* 無代幣 */}
      {!loading && !error && tokens.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>
          你還沒有發布任何代幣
        </p>
      )}

      {/* 代幣列表 */}
      {!loading && tokens.length > 0 && (
        <ul className="space-y-3">
          {tokens.map((token, index) => (
            <li
              key={token.objectId}
              className="token-item"
            >
              <div className="flex items-center gap-3">
                <span className="token-index">#{index + 1}</span>
                <span className="token-name">{token.name}</span>
              </div>
              <span className="token-type">{token.coinType.slice(0, 20)}...</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}