import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"
import P from "pino"

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: P({ level: "silent" })
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    const text = msg.message.conversation
    const jid = msg.key.remoteJid

    if (text === "!hola") {
      await sock.sendMessage(jid, { text: "Hola desde GitHub 🚀" })
    }
  })
}

startBot()
