const { mnemonicToPrivateKey, mnemonicNew } = require('@ton/crypto');
const { WalletContractV5R1 } = require('@ton/ton');
const fs = require('fs');
const readline = require('readline');

process.removeAllListeners('warning');

async function generateTonWallet() {
    const mnemonics = await mnemonicNew();
    const mnemonicString = mnemonics.join(' ');

    const keyPair = await mnemonicToPrivateKey(mnemonics);

    const workchain = 0;
    const walletV5 = WalletContractV5R1.create({
        workchain,
        publicKey: keyPair.publicKey,
    });

    const address = walletV5.address.toString({
        bounceable: false,
        urlSafe: true,
        testOnly: false,
    });


    return { mnemonicString, address };
}

async function main() {
    console.log("\n================================================================");
    console.log("                \x1b[94mTON W5/V5R1 Wallet Generator\x1b[0m                     ");
    console.log("================================================================");
    console.log("                                                                ");
    console.log("Skrip ini menghasilkan wallet TON versi W5/V5R1 secara acak.    ");
    console.log("Setiap wallet memiliki Address & Mnemonic. Data wallet akan     ");
    console.log("disimpan dalam file wallet.txt dan hanya Address yang           ");
    console.log("disimpan dalam file address.txt.                                ");
    console.log("                                                                ");
    console.log("            Github: \x1b[94mhttps://github.com/najibyahya\x1b[0m               ");
    console.log("              Telegram: \x1b[94mhttps://t.me/andraz404\x1b[0m                   ");
    console.log("                                                                ");
    console.log("================================================================");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (str) => new Promise(resolve => rl.question(str, resolve));

    const numWallets = await question("\nMasukkan jumlah wallet yang ingin dibuat: ");
    rl.close();

    for (let i = 0; i < numWallets; i++) {
        try {
            const { mnemonicString, address } = await generateTonWallet();

            fs.appendFileSync('wallet.txt', `Mnemonic: ${mnemonicString} \nAddress: ${address} \n\n`);
            fs.appendFileSync('address.txt', `${address}\n`);

            console.log(`\n\x1b[93mWallet ${i + 1}\x1b[0m`);
            console.log(`\x1b[94mAddress     : \x1b[92m${address}\x1b[0m`);
            console.log(`\x1b[94mMnemonic    : \x1b[92m${mnemonicString}\x1b[0m`);
        } catch (error) {
            console.error(`\n\x1b[91mGagal membuat wallet ${i + 1}:\x1b[0m`, error);
        }
    }

    console.log("\n\x1b[93mAddress & Mnemonic » wallet.txt");
    console.log("Address Only » address.txt\x1b[0m\n");
}

main();
