'use client'

import { useState, useCallback } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@iota/dapp-kit";
import { Transaction } from "@iota/iota-sdk/transactions";
import {getPublishData} from "@/lib/tokentemaple";

interface FormState{
    name:string;
    symbol:string;
    description:string;
    iconUrl: string;
    websitelink:string;    
}

type DeployStatus = 'idle' | 'building' | 'signing' | 'deploying' | 'success' | 'error';

export default function TokenForm(){
  
const [imageFile, setImageFile] = useState<File | null>(null);
  //const [imagePreview, setImagePreview] = useState<string>(''); 

  const [status, setStatus] = useState<DeployStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    name: '',
    symbol: '',
    description: '', 
    iconUrl: '', 
    websitelink: '',
  });

   const updateField = useCallback((field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  /*const handleImageUpload = useCallback((file: File, previewUrl: string) => {
    setImageFile(file);
    setImagePreview(previewUrl);
  }, []);*/

    const account = useCurrentAccount();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

    const validateForm = useCallback((): string | null => {
    if (!account) return '請先連接錢包';
    if (!form.name.trim()) return '請輸入代幣名稱';
    if (!form.symbol.trim()) return '請輸入代幣符號';
    if (form.symbol.length > 10) return '代幣符號不能超過 10 個字符';
    if (!form.description.trim()) return '請輸入代幣描述';
    if (!form.iconUrl.startsWith('http://') && !form.iconUrl.startsWith('https://')) {
      return '圖標 URL 必須以 http:// 或 https:// 開頭';}
    return null;
  }, [account, form ]);
    
    const handleDeploy = useCallback(async () => {
    // 1️⃣ 驗證表單
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setTxDigest(null);

      /* try {
      setStatus('building');
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      setStatus('signing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('deploying');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      
      setStatus('success');
      setTxDigest('模擬交易哈希_ABC123XYZ');
      
      console.log('✅ 模擬發幣成功！');

    } catch (err) {
      setStatus('error');
      setError('模擬發幣失敗');
    }
    }, [account, form, validateForm]);  */
       try {
      setStatus('building');
      
      // 準備代幣配置
      const publishData = await getPublishData({
        name: form.name.trim(),
        symbol: form.symbol.trim().toUpperCase(),
        description: form.description.trim(),
        iconUrl: form.iconUrl.trim(),
        websitelink: form.websitelink.trim(),
      });

      setStatus('signing');

      const tx = new Transaction();

      const [upgradeCap] = tx.publish({
        modules: publishData.modules,
        dependencies: publishData.dependencies,
      });

      tx.transferObjects([upgradeCap], account!.address);
      tx.setGasBudget(100000000);

      setStatus('deploying');

      const result = await signAndExecute({
        transaction: tx,
      });

      setStatus('success');
      setTxDigest(result.digest);

      setForm({
      name: '',
      symbol: '',
      description: '',
      iconUrl: '',
      websitelink: '',
     });

      console.log('Token deployed successfully!', result);

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : '部署失敗，請重試');
      console.error('Deploy error:', err);
    }
  }, [account, form, validateForm, signAndExecute]);

   const getStatusText = () => {
    switch (status) {
      case 'building': return '正在構建字節碼...';
      case 'signing': return '請在錢包中確認...';
      case 'deploying': return '正在部署到區塊鏈...';
      case 'success': return '🎉 代幣創建成功！點選即可再次鑄造';
      case 'error': return '部署失敗';
      default: return '一鍵發幣';
    }
  };
  
    

 return (
    <div className="space-y-6">
      {/* ========== 基本信息區塊 ========== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs text-cyan-400">1</span>
          基本信息
        </h3>

        {/* 代幣名稱 */}
        <div>
          <label className="input-label required">代幣名稱</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="例如：My Awesome Token"
            className="input-field"
            maxLength={50}
          />
        </div>

        {/* 代幣符號 */}
        <div>
          <label className="input-label required">代幣符號</label>
          <input
            type="text"
            value={form.symbol}
            onChange={(e) => updateField('symbol', e.target.value.toUpperCase())}
            placeholder="例如：MAT"
            className="input-field"
            maxLength={10}
          />
        </div>   
      </div>

         {/* ========== 圖標 URL 區塊 ========== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs text-cyan-400">2</span>
          代幣圖標
        </h3>
        
        <div>
          <label className="input-label required">圖標 URL</label>
          <input
            type="url"
            value={form.iconUrl}
            onChange={(e) => updateField('iconUrl', e.target.value)}
            placeholder="https://example.com/icon.png"
            className="input-field"
          />
          <p className="text-xs text-slate-500 mt-1">
            請輸入圖片的網址（支援 PNG、JPEG、WebP、GIF）
          </p>
        </div>

        {/* 圖片預覽 */}
        {form.iconUrl && (
          <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
            <img
              src={form.iconUrl}
              alt="Token icon preview"
              className="w-16 h-16 rounded-xl object-cover border border-slate-600"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              onLoad={(e) => {
                (e.target as HTMLImageElement).style.display = 'block';
              }}
            />
            <div className="text-sm text-slate-400">
              <p>圖片預覽</p>
              <p className="text-xs text-slate-500 mt-1">如果看不到圖片，請確認 URL 正確</p>
            </div>
          </div>
        )}
      </div>

      {/* ========== 描述區塊 ========== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs text-cyan-400">3</span>
          代幣描述
        </h3>

        <div>
          <label className="input-label required">描述內容</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="簡要描述你的代幣用途和特點..."
            className="input-field min-h-[120px] resize-none"
            maxLength={500}
          />
          <p className="text-xs text-slate-500 mt-1 text-right">{form.description.length}/500</p>
        </div>
      </div>

      {/* ========== 社交連結區塊（可選）========== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-600/50 flex items-center justify-center text-xs text-slate-400">4</span>
          社交連結
          <span className="text-xs text-slate-500 font-normal">（可選）</span>
        </h3>

      

          {/* Website */}
          <div>
            <label className="input-label">Website</label>
            <input
              type="url"
              value={form.websitelink}
              onChange={(e) => updateField('websitelink', e.target.value)}
              placeholder="https://..."
              className="input-field"
            />
          </div>
        </div>
      

      
      

      {/* ========== 錯誤訊息 ========== */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ========== 成功訊息 ========== */}
      {status === 'success' && txDigest && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 space-y-2">
          <p className="font-semibold">🎉 代幣創建成功！</p>
          <p className="text-sm break-all">
           digest：
            <a
              href={`https://iotascan.com/testnet/tx/${txDigest}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-300"
            >
              {txDigest}
            </a>
          </p>
        </div>
      )}

      {/* ========== 提交按鈕 ========== */}
      <button
        onClick={handleDeploy}
        disabled={!account || status === 'building' || status === 'signing' || status === 'deploying'}
        className={`btn-primary ${status !== 'idle' && status !== 'success' && status !== 'error' ? 'loading' : ''}`}
      >
        {!account ? '請先連接錢包' : getStatusText()}
      </button>
    </div>
  )
}