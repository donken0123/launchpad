//import{update_identifiers,update_constants}from '@mysten/move-bytecode-template'; 
import { bcs } from '@mysten/bcs';


function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const templatebytecode=`oRzrCwYAAAAKAQAMAgwkAzAtBF0MBWluB9cB0gEIqQNgBokEcwr8BAUMgQU7AAwCBwITAhQCFQEOAAICAAEADAEAAQEBDAEAAQEEDAEAAQMFAgAEBgcABQMHAQAAAAoAAQABCAgJAQIBCwoLAQACDwUBAQwCEA8BAQwDEQwNAAQNAwQABRIFBgEABwQBBwIHBA4DEAQRAggABwgEAAILAgEIAAsDAQgAAQoCAQgFAQkAAQsGAQkAAQgABwkAAgoCCgIKAgsGAQgFBwgEAgsDAQkACwIBCQADBwsDAQkAAwcIBAELAQEJAAEGCAQBBQELAQEIAAIJAAUBCwIBCAABCwMBCAAEQ29pbgxDb2luTWV0YWRhdGEGTVlDT0lOBk9wdGlvbgtUcmVhc3VyeUNhcAlUeENvbnRleHQDVXJsBGNvaW4PY3JlYXRlX2N1cnJlbmN5C2R1bW15X2ZpZWxkBGluaXQEbWludAZteWNvaW4VbmV3X3Vuc2FmZV9mcm9tX2J5dGVzBm9wdGlvbhRwdWJsaWNfZnJlZXplX29iamVjdA9wdWJsaWNfdHJhbnNmZXIGc2VuZGVyBHNvbWUIdHJhbnNmZXIKdHhfY29udGV4dAN1cmwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIDCACAxqR+jQMACgIDAmN0CgIIB0NhdGNvaW4KAgsKaSBsaWtlIGNhdAoCR0ZodHRwczovL2Nkbi5icml0YW5uaWNhLmNvbS8xNi8yMzQyMTYtMDUwLUM2NkY4NjY1L2JlYWdsZS1ob3VuZC1kb2cuanBnAAIBCQEAAAAAAhwLADEJBwEHAgcDBwQRBjgACgE4AQwCDAMNAwcACgE4AgoBLhEFOAMLAjgECwMLAS4RBTgFAgA=`;

export interface TokenParams {
  symbol: string;
  name: string;
  description: string;
  iconUrl: string;
  // mintAmount?: bigint;  // 可選
}

export async function getPublishData(params: TokenParams) {

  const { symbol, name, description, iconUrl } = params;
  const template = await import('@mysten/move-bytecode-template');
  await template.default(); // 初始化 WASM
  const bytecode = base64ToUint8Array(templatebytecode);
  let updated;
  //modulename
   updated =  template.update_identifiers(bytecode, {
    "MYCOIN": "IOTAPUMP"+name.toUpperCase(),
    "mycoin": "iotapump"+name.toLowerCase(),
  });
  
  /*  updated = template.update_constants(
    updated,
    // 鑄造數量
    bcs.u64().serialize(100000000000000).toBytes(),      // new value
    bcs.u64().serialize(1000000000000000).toBytes(), // old value
    'U64'                                  // type
  ); */
  updated = template.update_constants(
    updated,
    // symbol
    bcs.string().serialize(symbol).toBytes(),      // new value
    bcs.string().serialize("ct").toBytes(), // old value
    'Vector(U8)'                                  // type
  );

   updated = template.update_constants(
    updated,
    // name
    bcs.string().serialize(name).toBytes(),      // new value
    bcs.string().serialize('Catcoin').toBytes(), // old value
    'Vector(U8)'                                  // type
  );
   updated = template.update_constants(
    updated,
    // 描述
    bcs.string().serialize(description).toBytes(),      // new value
    bcs.string().serialize('i like cat').toBytes(), // old value
    'Vector(U8)'                                  // type
  );

   updated = template.update_constants(
    updated,
    // 圖片
    bcs.string().serialize(iconUrl).toBytes(),      // new value
    bcs.string().serialize('https://cdn.britannica.com/16/234216-050-C66F8665/beagle-hound-dog.jpg').toBytes(), // old value
    'Vector(U8)'                                  // type
  );
  


  const updatedBytecode = uint8ArrayToBase64(updated);

  return {
    modules: [updatedBytecode],
    dependencies: [
      '0x0000000000000000000000000000000000000000000000000000000000000001',
      '0x0000000000000000000000000000000000000000000000000000000000000002',
    ],
  };
}
/* const templatebytecode1= base64ToUint8Array(templatebytecode);
let updatedmodule=update_identifiers(templatebytecode1,{
    'MYCOIN':'DOG',
    'mycoin':'dog'
});

const updatedmodule1=uint8ArrayToBase64(updatedmodule);

export const publishData1 = {
  modules: [updatedmodule1],
  dependencies: [
    '0x0000000000000000000000000000000000000000000000000000000000000001',
    '0x0000000000000000000000000000000000000000000000000000000000000002',
  ],
}; */
