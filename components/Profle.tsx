'use client';

import { useEffect, useState } from 'react';
import { useCurrentAccount, useIotaClient } from '@iota/dapp-kit';

interface TokenInfo {
  coinType: string;
  name: string;
  symbol: string;
  objectId: string;
  version: number;
  iconUrl: string | null;  // 新增
}

export default function Profile() {
  const account = useCurrentAccount();
  const client = useIotaClient();
  
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractTokenName = (type: string): string | null => {
    const match = type.match(/TreasuryCap<.*::(\w+)>$/);
    if (!match) return null;
    
    const fullName = match[1];
    
    if (fullName.startsWith('IOTAPUMP')) {
      return fullName.slice(8);
    }
    
    return null;
  };

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

        // 先過濾出 TreasuryCap
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
              symbol: '',
              objectId: obj.data?.objectId || '',
              version: Number(obj.data?.version || 0),
              iconUrl: null as string | null,
            };
          })
          .filter((token) => token.name !== '')
          .sort((a, b) => a.version - b.version);

        // 查詢每個代幣的 metadata 獲取 icon
        const tokensWithMetadata = await Promise.all(
          treasuryCaps.map(async (token) => {
            try {
              const metadata = await client.getCoinMetadata({
                coinType: token.coinType,
              });
              return {
                ...token,
                symbol: metadata?.symbol || '',
                iconUrl: metadata?.iconUrl || null,
              };
            } catch {
              return token;
            }
          })
        );

        setTokens(tokensWithMetadata);
      } catch (err) {
        console.error('查詢失敗:', err);
        setError('無法載入代幣列表');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [account?.address, client]);

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

      {loading && (
        <p style={{ color: 'var(--text-secondary)' }}>載入中...</p>
      )}

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {!loading && !error && tokens.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>
          你還沒有發布任何代幣
        </p>
      )}

      {!loading && tokens.length > 0 && (
        <ul className="space-y-3">
          {tokens.map((token, index) => (
            <li key={token.objectId}>
              <a
                href={`https://iotascan.com/testnet/coin/${token.coinType}/txs`}
                target="_blank"
                rel="noopener noreferrer"
                className="token-item"
              >
                <div className="flex items-center gap-3">
                  <span className="token-index">#{index + 1}</span>
                  
                  {/* Icon */}
                  {token.iconUrl ? (
                    <img
                      src={token.iconUrl}
                      alt={token.name}
                      className="token-icon"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="token-icon-placeholder">🪙</div>
                  )}
                  
                  <div className="token-info">
                    <span className="token-name">{token.name}</span>
                    {token.symbol && (
                      <span className="token-symbol">${token.symbol}</span>
                    )}
                  </div>
                </div>
                <span className="token-type">{token.coinType.slice(0, 20)}...</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}