import logging
import json
from telethon import TelegramClient, events, functions
import os, os.path
from paralleltransfer import ParallelTransferrer
import telethon
from config import (
    session_name,
    api_id,
    api_hash,
    public_url,
    start_message,
    group_chat_message
)
from util import pack_id, get_file_name

log = logging.getLogger(__name__)

client = TelegramClient(session_name, api_id, api_hash)
transfer = ParallelTransferrer(client)



def add_video_to_db(name, desc, trailer, file_name, file_id, img_count):
    with open("data/data.json", "r") as file:
        data = json.load(file)
        data.append({
            "url": f"/static/img/{img_count}.jpg",
            "trailer": trailer,
            "name": name,
            "file_id": file_id,
            "file_name": file_name,
            "descrip": desc
        })
    with open("data/data.json", "w") as file:
        json.dump(data, file)


@client.on(events.NewMessage)
async def handle_message(evt: events.NewMessage.Event) -> None:
    if evt.is_private:
        if evt.message.text.startswith("הוספה") and evt.reply_to_msg_id:
            
            msg = evt.message.text.splitlines()
            name = msg[1].replace("שם:", "")
            desc = msg[2].replace("תקציר:", "")
            trailer = msg[3].replace("טריילר:", "")
            trailer.replace("watch?v=", "embed/")
            print(evt.reply_to_msg_id)
            reply_message_id = await client(functions.messages.GetMessagesRequest(id=[evt.reply_to_msg_id]))
            
            reply_msg = reply_message_id.messages[0].message.replace("Link to download file: ", "").replace(".html", "")
            file_id = reply_msg.split("/")[3]
            file_name = reply_msg.split("/")[4]
            img_count = 1
            for f in os.listdir("static/img"):
                if os.path.isfile("static/img/" + f):
                    print("is file!!")
                    img_count += 1
            print(img_count)
            await client.download_media(evt.message, file=f"static/img/{img_count}.jpg")
            add_video_to_db(name, desc, trailer, file_name, file_id, img_count)
            await evt.reply("Thanks, video added.")


        elif not evt.file:
            await evt.reply(start_message)
            return
        else:
            url = public_url / str(pack_id(evt)) / get_file_name(evt)
            await evt.reply(f"Link to download file: {url}.html")
            log.info(f"Replied with link for {evt.id} to {evt.from_id} in {evt.chat_id}")
            log.debug(f"Link to {evt.id} in {evt.chat_id}: {url}")
